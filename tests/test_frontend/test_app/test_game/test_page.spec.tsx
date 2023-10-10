import { screen, render } from "@/utils/test_utils";
import { mockQuestion } from "./test_components/test_question.spec";
import GamePage from "@/app/game/page";
import useFetchQuestionsList from "@/hooks/fetchQuestionsList";

const mockHookData = {
  questionsPoolReady: true,
  questionsLength: 1,
  questions: [mockQuestion],
  nextQuestionsSet: jest.fn(),
  questionIndex: 1,
  incrementIndex: jest.fn(),
  poolIndex: 0,
};

// mock `useFetchQuestionsList` hook
jest.mock("@/hooks/fetchQuestionsList");

// mock `useSearchParams` hook
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (query: string) => {
      return query === "difficulty" ? "easy" : "Mock Category";
    },
  }),
}));

describe("GamePage component", () => {
  it("Renders <RenderQuestions /> with questions", async () => {
    (useFetchQuestionsList as jest.Mock<any, any, any>).mockReturnValue(
      mockHookData
    );
    render(<GamePage />);

    const container = await screen.findByTestId("render-questions-container");
    expect(container).toBeInTheDocument();
  });

  it("Renders <RenderQuestions /> with no questions", async () => {
    (useFetchQuestionsList as jest.Mock<any, any, any>).mockReturnValue({
      ...mockHookData,
      questionIndex: {},
    });

    render(<GamePage />);

    const container = await screen.findByTestId(
      "all-questions-answered-container"
    );
    expect(container).toBeInTheDocument();
  });
});
