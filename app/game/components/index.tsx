/* Handle question logic */
"use client";
import RenderQuestion from "./question";
import { ReactNode, useState, useEffect, useRef, useContext } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import "animate.css";
import { useUser } from "@clerk/nextjs";
import { IQuestion } from "@/models/interfaces";
import { GameContext } from "./store";

export interface IQuestionProps {
  questionObj: IQuestion;
  index: number;
}

export default function Question({
  questionObj: { id, category, answers, correctAnswer, question, difficulty },
  index,
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
  const { user, isSignedIn } = useUser();
  const [error, setError] = useState("");
  const [_userAnswer, _setUserAnswer] = useState("");
  const userAnswer = useRef(_userAnswer);
  const setUserAnswer = (answer: string) => {
    userAnswer.current = answer;
    _setUserAnswer(answer);
  };

  const {
    updateProgress,
    submitProgress,
    questions,
    playerStats,
    setQuestionIndex,
  } = useContext(GameContext);

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
      { id, category, answers, correctAnswer, question, difficulty },
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
        { id, category, answers, correctAnswer, question, difficulty },
        ""
      );
    }

    setTimesUp(true);
    setTimerHasStarted(false);
  }

  async function handleNextQuestion() {
    if (CTA === "Submit Results") {
      if (user && isSignedIn) {
        try {
          await submitProgress(user.id);
          window.location.href = "/users/" + user.id;
        } catch (err: any) {
          setError(err as string);
        }
      } else {
        // check for unsaved data
        const unsavedData = localStorage.getItem("unsavedData");
        if (unsavedData) {
          const parsedData = JSON.parse(unsavedData);
          // merge previous unsaved data
          localStorage.setItem(
            "unsavedData",
            JSON.stringify({ ...playerStats, ...parsedData })
          );
        }

        // redirect to sign in
        window.location.href = "/sign-in";
      }
    } else setQuestionIndex((index: number) => index + 1);
  }

  async function handleViewProgress() {
    if (user && isSignedIn) {
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
        : index === questions.length
        ? "Submit Results"
        : "Next Question"
    );
  });

  return (
    <RenderQuestion
      {...{
        questionObj: {
          id,
          category,
          answers,
          correctAnswer,
          question,
          difficulty,
        },
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
