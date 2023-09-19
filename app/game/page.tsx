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

  const difficulty = params.get("difficulty");
  const categories = params.get("categories")?.split(",");

  function updateProgress(question: IQuestion, answer: string) {
    // Create an object to store all the progress updates
    const progressUpdate: Record<string, any> = {};

    // Update difficulty record
    progressUpdate[question.difficulty] = {
      correctAnswered: progress[question.difficulty]
        ? progress[question.difficulty].correctAnswered +
          (question.correctAnswer === answer ? 1 : 0)
        : question.correctAnswer === answer
        ? 1
        : 0,
      answered: progress[question.difficulty]
        ? progress[question.difficulty].answered + 1
        : 1,
    };

    // Update category record
    progressUpdate[question.category] = {
      [question.difficulty]: {
        correctAnswered: progress[question.category]
          ? progress[question.category][question.difficulty].correctAnswered +
            (question.correctAnswer === answer ? 1 : 0)
          : question.correctAnswer === answer
          ? 1
          : 0,
        answered: progress[question.category]
          ? progress[question.category][question.difficulty].answered + 1
          : 1,
      },
    };

    // Update total record
    progressUpdate.total = {
      correctAnswered:
        progress.total.correctAnswered +
        (question.correctAnswer === answer ? 1 : 0),
      answered: progress.total.answered + 1,
    };

    // Call setProgress once with the entire progress update object
    setProgress((state) => ({
      ...state,
      ...progressUpdate,
    }));
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
      exit={{ opacity: 0, }}
      transition={{ duration: 0.5 }}
    >
    <div className="game-page h-full flex-1 flex justify-center">
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
    </div>
    </motion.div>
  );
}
