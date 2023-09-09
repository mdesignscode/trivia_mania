import { ReactNode, useEffect, useState } from "react";
import { Button, QuestionBox } from "./styledComponents";
import Timer from "./timerCountdown";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export interface IQuestion {
  category: string;
  answers: Array<string>;
  correctAnswer: string;
  id: string;
  question: string;
  difficulty: string;
}

export interface IQuestionProps {
  questionObj: IQuestion
}

export default function Question({
  questionObj: { category, answers, correctAnswer, id, question, difficulty },
}: IQuestionProps) {
  const [answerFeedback, setAnswerFeedback] = useState<ReactNode[]>([
    <></>,
    <></>,
    <></>,
    <></>,
  ]);

  const handleUserAnswer = (value: string, i: number) => {
    setAnswerFeedback((state) =>
      state.map((_, j) => {
        if (i === j) {
          return value === correctAnswer ? (
            <CheckCircleIcon width={30} />
          ) : (
            <XCircleIcon width={30} />
          );
        }

        return j === answers.indexOf(correctAnswer) ? <CheckCircleIcon width={30} /> : <></>;
      })
    );
  };

  const colorMap: { [key: string]: string } = {
    easy: "green",
    medium: "gold",
    hard: "red",
  };

  return (
    <QuestionBox className="question flex flex-col gap-7 mx-auto rounded-lg pb-6 pt-2 px-6 w-2/3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{decodeHTMLEntities(question)}</h1>

        <p style={{ color: colorMap[difficulty] }}>
          {difficulty}
        </p>
      </div>

      <Timer />

      <div className="question_options grid grid-cols-2 grid-rows-2 gap-4">
        {answers.map((answer, i) => {
          return (
            <Button
              className="flex items-center"
              onClick={() => handleUserAnswer(answer, i)}
              key={answer}
            >
              <span>{answerFeedback[i]}</span>
              <p className="flex-1">{answer}</p>
            </Button>
          );
        })}
      </div>
    </QuestionBox>
  );
}

function decodeHTMLEntities(text: string) {
  const parser = new DOMParser();
  const decodedHTML = parser.parseFromString(text, "text/html");
  return decodedHTML.body.textContent;
}
