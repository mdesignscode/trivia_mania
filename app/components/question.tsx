"use client";
import { useUser } from "@clerk/nextjs";
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
  updateProgress: Function;
  submitProgress: Function;
}

export default function Question({
  questionObj: { category, answers, correctAnswer, question, difficulty },
  index,
  questionNumber,
  setIndex,
  questionsLength,
  updateProgress,
  submitProgress,
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
  const { user, isLoaded, isSignedIn } = useUser();
  const [error, setError] = useState(null)

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
    updateProgress(
      { category, answers, correctAnswer, question, difficulty },
      value
    );
    handleTimesUp();
  }

  function handleTimesUp() {
    setTimesUp(true);
    setTimerHasStarted(false);
  }

  async function handleNextQuestion() {
    if (CTA === "Submit Results") {
      if (isLoaded && isSignedIn) {
        const res = await submitProgress(user.id);
        if (res.message === "User stats updated successfully")
          window.location.href = "/users/" + user.id;
        else setError(res)
      } else window.location.href = "/sign-in";
    } else setIndex((index: number) => index + 1);
  }

  function handleViewProgress() {
    if (isLoaded && isSignedIn) {
      submitProgress(user.id);
      window.location.href = "/users/" + user.id;
    }
  }

  useEffect(() => {
    setCTA(
      !(index % 5)
        ? "Continue Playing"
        : index === questionsLength
        ? "Submit Results"
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
          <>
            <Button onClick={handleNextQuestion} $primary={true}>
              {CTA}
            </Button>

            {CTA === "Continue Playing" && (
              <Button onClick={handleViewProgress} $primary={true}>
                View Progress
              </Button>
            )}
          </>
        )}
        {error && <div>{error}</div>}
      </QuestionBox>
    </Transition>
  );
}

function decodeHTMLEntities(text: string) {
  const parser = new DOMParser();
  const decodedHTML = parser.parseFromString(text, "text/html");
  return decodedHTML.body.textContent;
}
