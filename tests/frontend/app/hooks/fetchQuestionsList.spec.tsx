import useFetchQuestionsList from "@/hooks/fetchQuestionsList";
import {
  CATEGORIES,
  CURRENT_INDEX,
  DIFFICULTY,
  NEW_PARAMS,
  QUESTIONS_LIST,
  QUESTIONS_POOL,
} from "@/utils/localStorage_utils";
import { mockQuestions } from "@/utils/mockData";
import { GlobalWrapper } from "@/utils/test_global_context";
import { act, renderHook } from "@/utils/test_utils";

jest.mock("@/components/localStorageDetection", () => true);

describe("useFetchQuestionsList hook", () => {
  describe("Local storage available", () => {
    it("Creates a questions pool in state if there is questions in localStorage", async () => {
      const Wrapper = GlobalWrapper();

      localStorage.setItem(CURRENT_INDEX, "5");
      localStorage.setItem(
        QUESTIONS_POOL,
        JSON.stringify(Object.values(mockQuestions).slice(0, 5))
      );
      localStorage.setItem(
        QUESTIONS_LIST,
        JSON.stringify(Object.values(mockQuestions).slice(0, 8))
      );

      // call custom hook with provider to provide storage availability
      const { result: initialState } = renderHook(
        () => useFetchQuestionsList(),
        {
          wrapper: Wrapper,
        }
      );

      // get values to test
      const {
        questions: initialQuestions,
        questionIndex: initialQuestionIndex,
        poolIndex: initialPoolIndex,
        nextQuestionsSet,
      } = initialState.current;

      // assert state initialization
      expect(initialQuestions).toHaveLength(5);
      expect(initialQuestionIndex).toBe(5);
      expect(initialPoolIndex).toBe(0);

      // get next set of questions
      act(() => {
        nextQuestionsSet();
      });

      // get updated state
      const {
        questions: updatedQuestions,
        questionIndex: updatedQuestionIndex,
        poolIndex: updatedPoolIndex,
      } = initialState.current;

      // assert new state
      expect(updatedQuestions).toHaveLength(3);
      expect(updatedQuestionIndex).toBe(6);
      expect(updatedPoolIndex).toBe(5);
    });

    it("Fetches new questions if newFilters state true", async () => {
      const Wrapper = GlobalWrapper({
        playFilters: {
          difficulty: "hard",
          categories: "Entertainment: Music",
        },
        newFilters: true
      });

      // call custom hook with provider to provide storage unavailability
      const { result: initialState } = renderHook(
        () => useFetchQuestionsList(),
        {
          wrapper: Wrapper,
        }
      );

      // get values to test
      const {
        questions: initialQuestions,
        questionIndex: initialQuestionIndex,
        poolIndex: initialPoolIndex,
      } = initialState.current;

      // assert state initialization
      expect(initialQuestions).toHaveLength(5);
      expect(initialQuestionIndex).toBe(1);
      expect(initialPoolIndex).toBe(0);

      // assert local storage initialization
      const localQuestionsList = JSON.parse(
          localStorage.getItem(QUESTIONS_LIST) as string
        ),
        localCategories = localStorage.getItem(CATEGORIES),
        localDifficulty = localStorage.getItem(DIFFICULTY),
        localFlag = localStorage.getItem(NEW_PARAMS);

      expect(localQuestionsList).toHaveLength(8);
      expect(localCategories).toBe("Entertainment: Music");
      expect(localDifficulty).toBe("hard");
      expect(localFlag).toBeNull();
    });
  });

  describe("Local storage unavailable", () => {
    it("Handles question fetching and pool creation with localStorage unavailable", async () => {
      const Wrapper = GlobalWrapper({ storageIsAvailable: false });
      // call custom hook with provider to provide storage availability
      const { result: initialState } = renderHook(
        () => useFetchQuestionsList(),
        {
          wrapper: Wrapper,
        }
      );

      // get values to test
      const {
        questions: initialQuestions,
        questionIndex: initialQuestionIndex,
        poolIndex: initialPoolIndex,
        nextQuestionsSet,
        incrementIndex,
      } = initialState.current;

      // assert state initialization
      expect(initialQuestions).toHaveLength(5);
      expect(initialQuestionIndex).toBe(1);
      expect(initialPoolIndex).toBe(0);

      // get next set of questions
      act(() => {
        for (let index = 0; index < 4; index++) {
          incrementIndex();
        }

        nextQuestionsSet();
      });

      // get updated state
      const {
        questions: updatedQuestions,
        questionIndex: updatedQuestionIndex,
        poolIndex: updatedPoolIndex,
      } = initialState.current;

      // assert new state
      expect(updatedQuestions).toHaveLength(3);
      expect(updatedQuestionIndex).toBe(6);
      expect(updatedPoolIndex).toBe(5);
    });
  });
});
