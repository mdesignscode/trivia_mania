"use client";
import { useUser } from "@clerk/nextjs";
import { ReactNode, Fragment, useState, useEffect, useRef } from "react";
import { Button, QuestionBox } from "./styledComponents";
import Timer from "./timerCountdown";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import "animate.css";

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
  const [error, setError] = useState(null);

  function handleUserAnswer(value: string, i: number) {
    // display icon based on correct answer
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

    // give user feedback on answer

    const el = document.getElementById(value);

    el?.style.setProperty("--animate-duration", "1s");
    if (value === correctAnswer) {
      const audio = document.getElementById("success") as HTMLAudioElement;
      audio.play();
      el?.classList.add("animate__tada");
    } else {
      const audio = document.getElementById("error") as HTMLAudioElement;
      audio.play();
      el?.classList.add("animate__shakeX");
    }

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
        else setError(res);
      } else window.location.href = "/sign-in";
    } else setIndex((index: number) => index + 1);
  }

  async function handleViewProgress() {
    if (isLoaded && isSignedIn) {
      const res = await submitProgress(user.id);
      if (res.message === "User stats updated successfully")
        window.location.href = "/users/" + user.id;
      else setError(res);
    } else {
      window.location.href = "/sign-in";
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
                className="flex justify-center gap-2 items-center animate__animated"
                onClick={() => handleUserAnswer(answer, i)}
                key={answer}
                id={answer}
              >
                <span>{answerFeedback[i]}</span>
                <p>{answer}</p>
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
        <audio id="success">
          <source src="/success.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <audio id="error">
          <source src="/error.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </QuestionBox>
    </Transition>
  );
}

function decodeHTMLEntities(text: string): string {
  const p = document.createElement("p")
  p.innerHTML = text
  return p.innerText
}
