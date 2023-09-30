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
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IGameContext {
  playerStats: IUserStats;
  submitProgress: (id: string) => Promise<any>;
  updateProgress: (question: IQuestion, answer: string) => void;
  questionIndex: number;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
  questions: IQuestion[];
}

const initialContext: IGameContext = {
  playerStats: initialStat,
  submitProgress: async () => {},
  updateProgress: () => {},
  questionIndex: 1,
  setQuestionIndex: () => {},
  questions: []
};

export const GameContext = createContext<IGameContext>(initialContext);

export function GameProvider({ children, questions }: { children: React.ReactNode, questions: IQuestion[] }) {
  const [playerStats, setPlayerStats] = useState<IUserStats>(initialStat);
  const { storageIsAvailable } = useContext(GlobalContext);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(1);

  function updateProgress(question: IQuestion, answer: string) {
    setAnsweredQuestions([...answeredQuestions, question.id]);

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
  }

  async function submitProgress(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/users/updateStats`;

    if (storageIsAvailable) {
      localStorage.setItem("progress", JSON.stringify(playerStats));
      localStorage.setItem(
        "answeredQuestions",
        JSON.stringify(answeredQuestions)
      );
    }

    try {
      const { data } = await axios.post(url, {
        stats: playerStats,
        id,
        answeredQuestions,
      });

      return data;
    } catch (error) {
      return error;
    }
  }

  const store: IGameContext = {
    submitProgress,
    updateProgress,
    questionIndex,
    setQuestionIndex,
    playerStats,
    questions
  };

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}
