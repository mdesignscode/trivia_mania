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
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
};

export const GameContext = createContext<IGameContext>(initialGameContext);

export function GameProvider({ children }: { children: ReactElement }) {
  const [_playerStats, _setPlayerStats] = useState<IUserStats>(initialStat);
  const playerStats = useRef(_playerStats);
  function setPlayerStats(setState: (state: IUserStats) => IUserStats) {
    const newState = setState(playerStats.current);
    playerStats.current = newState;
    _setPlayerStats(newState);
  }
  const [_answeredQuestions, _setAnsweredQuestions] = useState<string[]>([]);
  const answeredQuestions = useRef(_answeredQuestions);
  function setAnsweredQuestions(setState: (state: string[]) => string[]) {
    const newState = setState(answeredQuestions.current);
    answeredQuestions.current = newState;
    _setAnsweredQuestions(newState);
  }

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [makeRequest, setMakeRequest] = useState(true);

  const [startPlaying, setStartPlaying] = useState(false);

  const {
    storageIsAvailable,
    userStatus: { user },
  } = useContext(GlobalContext);

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
      const url = `${baseUrl}/users/updateStats`;

      const { data } = await axios.post(url, {
        stats: playerStats.current,
        id: user?.id,
        answeredQuestions: answeredQuestions.current,
      } as IUpdateUserStatsRequest);

      return data;
    },
    enabled: shouldSubmit,
  });

  // restore previous progress state
  useEffect(() => {
    // get previous answered questions and progress
    const localAnsweredQuestions =
      localStorage.getItem(ANSWERED_QUESTIONS) || "";
    const localProgress =
      localStorage.getItem(PROGRESS) || JSON.stringify(initialStat);

    // set state
    setPlayerStats(() => JSON.parse(localProgress));
    setAnsweredQuestions(() => localAnsweredQuestions.split(","));
  }, []);

  const updateProgress = useCallback(
    (question: IQuestion, answer: string) => {
      setAnsweredQuestions((state) =>
        state.length ? [...state, question.id] : [question.id]
      );

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

        return newState;
      });

      if (storageIsAvailable) {
        localStorage.setItem(PROGRESS, JSON.stringify(playerStats.current));
        localStorage.setItem(
          ANSWERED_QUESTIONS,
          answeredQuestions.current.join(",")
        );
        localStorage.setItem(UNSAVED_DATA, JSON.stringify(playerStats.current));
      }
    },
    [storageIsAvailable]
  );

  const submitProgress = useCallback(() => {
    if (user && makeRequest) {
      setShouldSubmit(true);

      if (isError) {
        setErrorMessage((error as any).message);
        setShouldSubmit(false);
        return;
      }

      if (isFetched) {
        if (storageIsAvailable) {
          clearQuestionData();
        }

        setShouldSubmit(false);
        setMakeRequest(false);

        const testEnv = process.env.testEnv;

        if (!testEnv) window.location.href = "/users/" + user.id;
      }
    }
  }, [error, isError, isFetched, storageIsAvailable, user, makeRequest]);

  const store: IGameContext = {
    submitProgress,
    updateProgress,
    questionIndex,
    incrementIndex,
    playerStats: playerStats.current,
    questions,
    questionsLength,
    nextQuestionsSet,
    poolIndex,
    startPlaying,
    setStartPlaying,
    error: errorMessage,
    setQuestionsPool,
  };

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}
