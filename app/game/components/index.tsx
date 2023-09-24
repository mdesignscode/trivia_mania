/* Handle question logic */
"use client";
import RenderQuestion from "./question";
import { useUser } from "@clerk/nextjs";
import { ReactNode, useState, useEffect, useRef } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import "animate.css";

export interface IQuestion {
  category: string;
  answers: Array<string>;
  correctAnswer: string;
  id?: string;
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
  const [error, setError] = useState("");
  const [_userAnswer, _setUserAnswer] = useState("");
  const userAnswer = useRef(_userAnswer);
  const setUserAnswer = (answer: string) => {
    userAnswer.current = answer;
    _setUserAnswer(answer);
  };

  function handleUserAnswer(value: string, i: number) {
    setUserAnswer(value);
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
    // display correct answer if user did not click any button
    if (!userAnswer.current) {
      // animate correct answer
      const el = document.getElementById(correctAnswer);
      el?.style.setProperty("--animate-duration", "1s");
      el?.classList.add("animate__rubberBand");

      updateProgress(
        { category, answers, correctAnswer, question, difficulty },
        ""
      );
    }

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
      if (res.message === "User stats updated successfully") {
        window.location.href = "/users/" + user.id;
      } else setError("Couldn't save progress. Try again.");
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

  return (
    <RenderQuestion
      {...{
        questionObj: { category, answers, correctAnswer, question, difficulty },
        questionNumber,
        index,
        handleTimesUp,
        timerHasStarted,
        handleUserAnswer,
        error,
        CTA,
        timesUp,
        handleNextQuestion,
        handleViewProgress,
        userAnswer,
        answerFeedback,
      }}
    />
  );
}
