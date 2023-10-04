/* Handle question logic */
"use client";
import { IQuestion } from "@/models/interfaces";
import { useUser } from "@clerk/nextjs";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import "animate.css";
import { GlobalContext } from "app/store";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import RenderQuestion from "./question";
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
  // set question state
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

  // consume game context
  const {
    updateProgress,
    submitProgress,
    nextQuestionsSet,
    playerStats,
    questionsLength,
    incrementIndex,
    questionIndex,
  } = useContext(GameContext);

  const { storageIsAvailable } = useContext(GlobalContext);

  function handleUserAnswer(value: string, i: number) {
    if (storageIsAvailable) {
      localStorage.setItem("questionAnswered", "true");
      localStorage.setItem("lastAnswer", value);
      localStorage.setItem("lastAnswerIndex", i.toString());
    }

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
        const res = await submitProgress(user.id);
        if (res === "User stats updated successfully") {
          window.location.href = "/users/" + user.id;
        } else setError(res);
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
    } else if (CTA === "Continue Playing") {
      nextQuestionsSet();
    } else {
      if (questionIndex === questionsLength && storageIsAvailable) {
        localStorage.setItem("unsavedData", JSON.stringify(playerStats));
        localStorage.setItem("hasUnsavedData", "true");
      }
      incrementIndex();
    }
  }

  async function handleViewProgress() {
    if (user && isSignedIn) {
      const res = await submitProgress(user.id);
      if (res === "User stats updated successfully") {
        window.location.href = "/users/" + user.id;
      } else setError(res);
    } else {
      window.location.href = "/sign-in";
    }
  }

  useEffect(() => {
    // determine which action to take on question answer
    setCTA(
      !(index % 5)
        ? "Continue Playing"
        : index === questionsLength
        ? "Submit Results"
        : "Next Question"
    );

    // check if current question has already been answered
    if (storageIsAvailable && questionIndex === index) {
      // get state from local storage
      const isQuestionAnswered =
        localStorage.getItem("questionAnswered") || "false";
      const prevAnswer = localStorage.getItem("lastAnswer");
      const prevAnswerIndex = parseInt(
        localStorage.getItem("lastAnswerIndex") || "0"
      );

      if (isQuestionAnswered === "true") {
        handleTimesUp();

        // display icon based on correct answer
        setAnswerFeedback((state) =>
          state.map((_, j) => {
            if (prevAnswerIndex === j) {
              return prevAnswer === correctAnswer ? (
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
      }
    }
  }, []);

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
