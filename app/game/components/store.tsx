/* Handle all logic for game page */
"use client";

import {
  CategoryStat,
  DifficultyStat,
  IQuestion,
  IUserStats,
  initialStat,
} from "@/models/interfaces";
import { GlobalContext } from "app/store";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface IGameContext {
  playerStats: IUserStats;
  submitProgress: (id: string) => Promise<any>;
  updateProgress: (question: IQuestion, answer: string) => void;
  questions: IQuestion[];
  nextQuestionsSet: () => void;
  questionsLength: number;
  questionIndex: number;
  incrementIndex: () => void;
  poolIndex: number;
}

const initialContext: IGameContext = {
  playerStats: initialStat,
  submitProgress: async () => {},
  updateProgress: () => {},
  questions: [],
  nextQuestionsSet: () => {},
  questionsLength: 0,
  questionIndex: 1,
  incrementIndex: () => {},
  poolIndex: 0,
};

export const GameContext = createContext<IGameContext>(initialContext);

interface GameProviderProps {
  children: React.ReactNode;
  questions: IQuestion[];
  nextQuestionsSet: () => void;
  questionsLength: number;
  questionIndex: number;
  incrementIndex: () => void;
  poolIndex: number;
}

export function GameProvider({
  children,
  questions,
  nextQuestionsSet,
  questionsLength,
  questionIndex,
  incrementIndex,
  poolIndex,
}: GameProviderProps) {
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

  const { storageIsAvailable } = useContext(GlobalContext);

  // restore previous progress state
  useEffect(() => {
    // get previous answered questions and progress
    const localAnsweredQuestions =
      localStorage.getItem("answeredQuestions") || "";
    const localProgress =
      localStorage.getItem("progress") || JSON.stringify(initialStat);

    // set state
    setPlayerStats(() => JSON.parse(localProgress))
    setAnsweredQuestions(() => localAnsweredQuestions.split(","))
  }, []);

  function updateProgress(question: IQuestion, answer: string) {
    setAnsweredQuestions((state) => [...state, question.id]);

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

    localStorage.setItem("progress", JSON.stringify(playerStats.current));
    localStorage.setItem(
      "answeredQuestions",
      answeredQuestions.current.join(",")
    );
  }

  async function submitProgress(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/users/updateStats`;

    const { data } = await axios.post(url, {
      stats: playerStats.current,
      id,
      answeredQuestions: answeredQuestions.current,
    });

    if (storageIsAvailable) {
      localStorage.removeItem("unsavedData");
      localStorage.setItem("hasUnsavedData", "false");
      localStorage.removeItem("questionsList");
      localStorage.removeItem("questionsPool");
      localStorage.removeItem("poolIndex");
      localStorage.removeItem("currentIndex");
      localStorage.removeItem("answeredQuestions");
    }

    return data;
  }

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
  };

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}
