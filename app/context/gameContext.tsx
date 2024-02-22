/* Handle all logic for game page */
"use client";

import { GlobalContext } from "@/app/context/globalContext";
import useFetchQuestionsList from "@/hooks/fetchQuestionsList";
import { IUpdateUserStatsRequest } from "@/models/customRequests";
import {
  CategoryStat,
  DifficultyStat,
  IQuestion,
  IUserStats,
  initialStat,
} from "@/models/interfaces";
import {
  ANSWERED_QUESTIONS,
  PROGRESS,
  UNSAVED_DATA,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IGameContext {
  playerStats: IUserStats;
  submitProgress: (testEnv?: boolean) => void;
  updateProgress: (question: IQuestion, answer: string) => void;
  questions: IQuestion[];
  nextQuestionsSet: () => void;
  questionsLength: number;
  questionIndex: number;
  incrementIndex: () => void;
  poolIndex: number;
  startPlaying: boolean;
  setStartPlaying: Dispatch<SetStateAction<boolean>>;
  error: string;
  setQuestionsPool: (state: IQuestion[]) => void;
  answeredQuestions: string[];
  hasSubmit: boolean;
}

export const initialGameContext: IGameContext = {
  playerStats: initialStat,
  submitProgress: () => {},
  updateProgress: () => {},
  questions: [],
  nextQuestionsSet: () => {},
  questionsLength: 0,
  questionIndex: 1,
  incrementIndex: () => {},
  poolIndex: 0,
  setStartPlaying: () => {},
  startPlaying: false,
  error: "",
  setQuestionsPool: () => {},
  answeredQuestions: [],
  hasSubmit: false,
};

export const GameContext = createContext<IGameContext>(initialGameContext);

export function GameProvider({ children }: { children: ReactElement }) {
  const [playerStats, setPlayerStats] = useState<IUserStats>(initialStat);
  const [hasSubmit, setHasSubmit] = useState(false);

  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [startPlaying, setStartPlaying] = useState(false);

  const router = useRouter();

  const { storageIsAvailable, triviaUser } = useContext(GlobalContext);

  const {
    questionIndex,
    poolIndex,
    nextQuestionsSet,
    questions,
    incrementIndex,
    questionsLength,
    setQuestionsPool,
  } = useFetchQuestionsList();

  const { isError, isFetched, error } = useQuery({
    queryKey: ["submitProgress"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}users/updateStats`;

      const { data } = await axios.post(url, {
        stats: playerStats,
        id: triviaUser?.id,
        answeredQuestions: answeredQuestions.filter(Boolean),
      } as IUpdateUserStatsRequest);

      return data;
    },
    enabled: shouldSubmit,
  });

  // restore previous progress state
  useEffect(() => {
    if (storageIsAvailable) {
      // get previous answered questions and progress
      const localAnsweredQuestions =
        localStorage.getItem(ANSWERED_QUESTIONS) || "";
      const localProgress =
        localStorage.getItem(PROGRESS) || JSON.stringify(initialStat);

      // set state
      setPlayerStats(() => JSON.parse(localProgress));
      setAnsweredQuestions(() => localAnsweredQuestions.split(","));
    }
  }, [storageIsAvailable]);

  useEffect(() => {
    if (isError) {
      setErrorMessage((error as any).message);
      return;
    }

    if (isFetched && triviaUser) {
      if (storageIsAvailable) {
        clearQuestionData();
      }
      setHasSubmit(true);
      router.push("/stats" + triviaUser.id);
    }
  }, [error, isError, isFetched, router, storageIsAvailable, triviaUser]);

  const updateProgress = (question: IQuestion, answer: string) => {
    setAnsweredQuestions((state) => {
      const truthyAnswered = state.filter(Boolean);
      const newState = truthyAnswered.length
        ? [...state, question.id]
        : [question.id];

      if (storageIsAvailable) {
        localStorage.setItem(
          ANSWERED_QUESTIONS,
          Array.from(new Set(newState)).join(",")
        );
      }
      return newState;
    });

    setPlayerStats((state) => {
      const newState = {
        ...JSON.parse(JSON.stringify(state)),
      };
      const isCorrect = answer === question.correctAnswer;

      // difficulty
      const difficultyKey = question.difficulty;
      const difficultyStat = state[difficultyKey] as DifficultyStat;
      if (state[difficultyKey]) {
        // increment old state
        newState[difficultyKey].answered = difficultyStat.answered + 1;
        newState[difficultyKey].correctAnswered = isCorrect
          ? difficultyStat.correctAnswered + 1
          : difficultyStat.correctAnswered;
      } else {
        // create new object
        newState[difficultyKey] = {
          answered: 1,
          correctAnswered: isCorrect ? 1 : 0,
        };
      }

      // category
      const categoryKey = question.category;
      const categoryStat = state[categoryKey] as CategoryStat;

      if (categoryStat) {
        const categoryDifficulty = categoryStat[
          difficultyKey
        ] as DifficultyStat;
        if (categoryDifficulty) {
          // increment old category difficulty
          newState[categoryKey][difficultyKey].answered =
            categoryDifficulty.answered + 1;
          newState[categoryKey][difficultyKey].correctAnswered = isCorrect
            ? categoryDifficulty.correctAnswered + 1
            : categoryDifficulty.correctAnswered;
        } else {
          // set new category difficulty
          newState[categoryKey][difficultyKey] = {
            answered: 1,
            correctAnswered: isCorrect ? 1 : 0,
          };
        }
      } else {
        newState[categoryKey] = {
          [difficultyKey]: {
            answered: 1,
            correctAnswered: isCorrect ? 1 : 0,
          },
        };
      }

      // increment total
      newState.total.answered++;
      newState.total.correctAnswered += isCorrect ? 1 : 0;

      if (storageIsAvailable) {
        localStorage.setItem(PROGRESS, JSON.stringify(newState));
        localStorage.setItem(UNSAVED_DATA, JSON.stringify(newState));
      }

      return newState;
    });
  };

  const submitProgress = () => {
    if (triviaUser) {
      setShouldSubmit(true);
    }
  };

  const store: IGameContext = {
    submitProgress,
    updateProgress,
    questionIndex,
    incrementIndex,
    playerStats,
    questions,
    questionsLength,
    nextQuestionsSet,
    poolIndex,
    startPlaying,
    setStartPlaying,
    error: errorMessage,
    setQuestionsPool,
    answeredQuestions,
    hasSubmit,
  };

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}
