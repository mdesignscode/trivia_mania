"use client";

import { useState } from "react";
import Question from "./question";
import useGameStore from "./store";

export default function RenderQuestions() {
  const { questions } = useGameStore(),
    [questionIndex, setQuestionIndex] = useState(0);

  return (
    <div className="col gap-4 items-center p-4">
      <h2 className="text-xl font-bold">
        Question {questionIndex + 1} of {questions.length}
      </h2>
      {questions.map((question, index) => (
        <Question
          question={question as NonNullable<TQuestion>}
          key={question?.id}
          index={index}
          questionIndex={questionIndex}
          setQuestionIndex={setQuestionIndex}
        />
      ))}
    </div>
  );
}
