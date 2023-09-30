"use client";
import {
  CategoryStat,
  DifficultyStat,
  IQuestion,
  IUserStats,
  initialStat,
} from "@/models/interfaces";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "app/store";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import RenderQuestions from "./components/renderQuestions";

export default function GamePage() {
  const params = useSearchParams();
  const [questionIndex, setQuestionIndex] = useState(1);
  const [playerStats, setPlayerStats] = useState<IUserStats>(initialStat);
  const { storageIsAvailable } = useContext(GlobalContext);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])

  const difficulty = params.get("difficulty") || "";
  const categoriesString = params.get("categories");
  const categories = categoriesString ? categoriesString.split(",") : [];

  function updateProgress(question: IQuestion, answer: string) {
    setAnsweredQuestions([...answeredQuestions, question.id])

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
        const categoryDifficulty = categoryStat[difficultyKey] as DifficultyStat;
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
      localStorage.setItem("answeredQuestions", JSON.stringify(answeredQuestions));
    }

    try {
      const { data } = await axios.post(url, { stats: playerStats, id, answeredQuestions, });

      return data;
    } catch (error) {
      return error;
    }
  }

  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}questions/play`;

    const { data } = await axios.post(url, { difficulty, categories });

    return data;
  }

  const { data } = useQuery({
    queryKey: ["play"],
    queryFn: getQuestions,
    initialData: [],
  });

  return (
    <RenderQuestions
      {...{
        data,
        questionIndex,
        setQuestionIndex,
        updateProgress,
        submitProgress,
        playerStats,
      }}
    />
  );
}
