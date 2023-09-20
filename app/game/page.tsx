"use client";
import { motion } from "framer-motion";
import Loading from "app/loading";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import QuestionComponent from "@/components/question";
import { useState } from "react";
import { IQuestion } from "@/models/interfaces";

export default function GamePage() {
  const params = useSearchParams();
  const [questionIndex, setQuestionIndex] = useState(1);
  const [progress, setProgress] = useState<Record<string, Record<string, any>>>(
    { total: { answered: 0, correctAnswered: 0 } }
  );

  const difficulty = params.get("difficulty") || "";
  const categoriesString = params.get("categories");
  const categories = categoriesString ? categoriesString.split(",") : [];

  function updateProgress(question: IQuestion, answer: string) {
    setProgress((state) => {
      const newState: Record<string, Record<string, any>> = {
        ...JSON.parse(JSON.stringify(state))
      };
      const isCorrect = answer === question.correctAnswer;

      // difficulty
      const difficultyKey = question.difficulty;
      if (state[difficultyKey]) {
        // increment old state
        newState[difficultyKey].answered = state[difficultyKey].answered + 1;
        newState[difficultyKey].correctAnswered = isCorrect
          ? state[difficultyKey].correctAnswered + 1
          : state[difficultyKey].correctAnswered;
      } else {
        // create new object
        newState[difficultyKey] = {
          answered: 1,
          correctAnswered: isCorrect ? 1 : 0,
        };
      }

      // category
      const categoryKey = question.category;
      if (state[categoryKey]) {
        if (state[categoryKey][difficultyKey]) {
          // increment old category difficulty
          newState[categoryKey][difficultyKey].answered =
            state[categoryKey][difficultyKey].answered + 1;
          newState[categoryKey][difficultyKey].correctAnswered = isCorrect
            ? state[categoryKey][difficultyKey].correctAnswered + 1
            : state[categoryKey][difficultyKey].correctAnswered;
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

    try {
      const { data } = await axios.post(url, { stats: progress, id });
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="game-page h-full flex-1 flex justify-center"
    >
      <div className="flex flex-col justify-center items-center gap-4 max-w-3xl mx-8 h-full">
        {data.length ? (
          <>
            <h1 className="text-2xl">
              Question {questionIndex} of {data.length}
            </h1>
            {data.map((question: IQuestion, i: number) => {
              return (
                <QuestionComponent
                  setIndex={setQuestionIndex}
                  questionNumber={questionIndex}
                  index={i + 1}
                  questionObj={question}
                  key={question.id}
                  questionsLength={data.length}
                  updateProgress={updateProgress}
                  submitProgress={submitProgress}
                />
              );
            })}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}
