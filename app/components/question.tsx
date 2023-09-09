"use client";
import { ReactNode, Fragment, useState, useEffect } from "react";
import { Button, QuestionBox } from "./styledComponents";
import Timer from "./timerCountdown";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

export interface IQuestion {
  category: string;
  answers: Array<string>;
  correctAnswer: string;
  id: string;
  question: string;
  difficulty: string;
}

export interface IQuestionProps {
  questionObj: IQuestion;
  index: number;
  questionNumber: number;
  setIndex: Function;
  questionsLength: number;
}

export default function Question({
  questionObj: { category, answers, correctAnswer, question, difficulty },
  index,
  questionNumber,
  setIndex,
  questionsLength,
}: IQuestionProps) {
  const [answerFeedback, setAnswerFeedback] = useState<ReactNode[]>([
    <></>,
    <></>,
    <></>,
    <></>,
  ]);
  const [timesUp, setTimesUp] = useState(false);
  const [CTA, setCTA] = useState("Next Question");
  const [timerHasStarted, setTimerHasStarted] = useState(true);

  function handleUserAnswer(value: string, i: number) {
    setAnswerFeedback((state) =>
      state.map((_, j) => {
        if (i === j) {
          return value === correctAnswer ? (
            <CheckCircleIcon width={30} />
          ) : (
            <XCircleIcon width={30} />
          );
        }

        return j === answers.indexOf(correctAnswer) ? (
          <CheckCircleIcon width={30} />
        ) : (
          <></>
        );
      })
    );

    handleTimesUp();
  }

  function handleTimesUp() {
    setTimesUp(true);
    setTimerHasStarted(false);
  }

  function handleNextQuestion() {
    if (CTA === "Back to home") window.location.href = "/";
    else setIndex((index: number) => index + 1);
  }

  useEffect(() => {
    setCTA(
      !(index % 5)
        ? "Play More"
        : index === questionsLength
        ? "Back to home"
        : "Next Question"
    );
  });

  const colorMap: { [key: string]: string } = {
    easy: "green",
    medium: "gold",
    hard: "red",
  };

  return (
    <Transition
      as={Fragment}
      show={questionNumber === index}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <QuestionBox className="question flex flex-col gap-7 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">{category}</h1>

          <p className="text-xl" style={{ color: colorMap[difficulty] }}>
            {difficulty}
          </p>
        </div>

        <h1 className="text-2xl">{decodeHTMLEntities(question)}</h1>

        <Timer
          handleTimesUp={handleTimesUp}
          timerHasStarted={timerHasStarted}
        />

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

        {timesUp && (
          <Button onClick={handleNextQuestion} $primary={true}>
            {CTA}
          </Button>
        )}
      </QuestionBox>
    </Transition>
  );
}

function decodeHTMLEntities(text: string) {
  const parser = new DOMParser();
  const decodedHTML = parser.parseFromString(text, "text/html");
  return decodedHTML.body.textContent;
}
