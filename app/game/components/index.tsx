/* Handle question logic */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { GameContext } from "@/context/gameContext";
import { calculateNewIndex } from "@/hooks/fetchQuestionsList";
import { IQuestion } from "@/models/interfaces";
import {
  LAST_ANSWER,
  LAST_ANSWER_INDEX,
  QUESTIONS_LIST,
  QUESTIONS_POOL,
  QUESTION_ANSWERED,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import "animate.css";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import RenderQuestion from "./question";
import { useRouter } from "next/navigation";

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
  const [_userAnswer, _setUserAnswer] = useState("");
  const userAnswer = useRef(_userAnswer);
  const setUserAnswer = (answer: string) => {
    userAnswer.current = answer;
    _setUserAnswer(answer);
  };

  const router = useRouter()

  const [timerHasStarted, setTimerHasStarted] = useState(true);

  // consume game context
  const {
    updateProgress,
    submitProgress,
    nextQuestionsSet,
    questionsLength,
    incrementIndex,
    questionIndex,
    setQuestionsPool,
  } = useContext(GameContext);

  const { storageIsAvailable, triviaUser } = useContext(GlobalContext);

  function handleUserAnswer(value: string, i: number) {
    if (storageIsAvailable) {
      localStorage.setItem(QUESTION_ANSWERED, "true");
      localStorage.setItem(LAST_ANSWER, value);
      localStorage.setItem(LAST_ANSWER_INDEX, i.toString());
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

  const handleTimesUp = useCallback(() => {
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
  }, [
    answers,
    category,
    correctAnswer,
    difficulty,
    id,
    question,
    setTimerHasStarted,
    updateProgress,
  ]);

  function handleNextQuestion() {
    switch (CTA) {
      case "Submit Results":
        if (triviaUser) {
          submitProgress();
        } else {
          // redirect to sign in
          router.push("/sign-in")
        }
        break;

      case "Continue Playing":
        nextQuestionsSet();
        break;

      default:
        incrementIndex();
        break;
    }
  }

  function handleViewProgress() {
    if (triviaUser) {
      submitProgress();
    } else {
      router.push("/sign-in")
    }
  }

  function handleContinueLater() {
    if (storageIsAvailable) {
      const newIndex = calculateNewIndex(questionIndex, questionsLength),
        localQuestionsList = JSON.parse(
          localStorage.getItem(QUESTIONS_LIST) || "[]"
        );
      clearQuestionData();

      // create new question pool
      const newPool = localQuestionsList.slice(questionIndex, newIndex);
      localStorage.setItem(QUESTIONS_POOL, JSON.stringify(newPool));
      localStorage.setItem(QUESTIONS_LIST, JSON.stringify(localQuestionsList));

      setQuestionsPool(newPool);
    }

    // submit current progress
    submitProgress();
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
      const isQuestionAnswered = localStorage.getItem(QUESTION_ANSWERED);
      const prevAnswer = localStorage.getItem(LAST_ANSWER);
      const prevAnswerIndex = parseInt(
        localStorage.getItem(LAST_ANSWER_INDEX) || "0"
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
  }, [
    answers,
    correctAnswer,
    handleTimesUp,
    index,
    questionIndex,
    questionsLength,
    storageIsAvailable,
  ]);

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
        timerHasStarted,
        index,
        handleTimesUp,
        handleUserAnswer,
        CTA,
        timesUp,
        handleNextQuestion,
        handleViewProgress,
        userAnswer: userAnswer.current,
        answerFeedback,
        handleContinueLater,
      }}
    />
  );
}
