"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Question from "@/models/question";
import QuestionComponent, { IQuestionProps } from "@/components/question";
import { useEffect, useState } from "react";
import { IQuestion } from "@/models/interfaces";

export default function GamePage() {
  const params = useSearchParams();
  const [questionIndex, setQuestionIndex] = useState(1);

  const difficulty = params.get("difficulty");
  const categories = params.get("categories");

  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}questions/play?difficulty=${difficulty}&categories=${categories}`;

    const { data } = await axios.get(url);
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
            <h1 className="text-2xl">Question {questionIndex} of {data.length}</h1>
            {data.map((question: IQuestion, i: number) => {
              return (
                <QuestionComponent
                  setIndex={setQuestionIndex}
                  questionNumber={questionIndex}
                  index={i + 1}
                  questionObj={question}
                  key={question.id}
                  questionsLength={data.length}
                />
              );
            })}
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}
