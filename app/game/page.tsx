"use client";
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
    // difficulty record
    if (progress[question.difficulty]) {
      // increment difficulty record in state if exists
      setProgress((state) => {
        return {
          ...state,
          [question.difficulty]: {
            correctAnswered:
              question.correctAnswer === answer
                ? state[question.difficulty].correctAnswered + 1
                : state[question.difficulty].correctAnswered,
            answered: state[question.difficulty].answered + 1,
          },
        };
      });
    } else {
      // else set difficulty record in state
      setProgress((state) => {
        return {
          ...state,
          [question.difficulty]: {
            answered: 1,
            correctAnswered: question.correctAnswer === answer ? 1 : 0,
          },
        };
      });
    }

    // category record
    if (progress[question.category]) {
      // increment category record in state if exists
      setProgress((state) => {
        return {
          ...state,
          [question.category]: {
            [question.difficulty]: {
              correctAnswered:
                question.correctAnswer === answer
                  ? state[question.category][question.difficulty]
                      .correctAnswered + 1
                  : state[question.category][question.difficulty]
                      .correctAnswered,
              answered:
                state[question.category][question.difficulty].answered + 1,
            },
          },
        };
      });
    } else {
      // else set category record in state
      setProgress((state) => {
        return {
          ...state,
          [question.category]: {
            [question.difficulty]: {
              correctAnswered: question.correctAnswer === answer ? 1 : 0,
              answered: 1,
            },
          },
        };
      });
    }

    // update total record
    setProgress((state) => ({
      ...state,
      total: {
        correctAnswered:
          question.correctAnswer === answer
            ? state.total.correctAnswered + 1
            : state.total.correctAnswered,
        answered: state.total.answered + 1,
      },
    }));
  }

  async function submitProgress(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/users/updateStats`;

    try {
      const { data } = await axios.post(url, { stats: progress, id });
      return data
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
  );
}
