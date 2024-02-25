import storageAvailable from "@/components/localStorageDetection";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

export type TTimerState = "started" | "ended";
type TSetTimerState = Dispatch<SetStateAction<TTimerState>>;

interface IHandleUserAnswerProps {
  setshouldSubmit: Dispatch<SetStateAction<boolean>>
  setTriviaUser: Dispatch<SetStateAction<TUser>>;
  value: string;
  i: number;
  questionIndex: number;
  setUserAnswer: Dispatch<SetStateAction<string>>;
  setAnswerFeedback: Dispatch<SetStateAction<(JSX.Element | null)[]>>;
  correctAnswer: string;
  answers: string[];
  setTimerState: TSetTimerState;
  router: AppRouterInstance;
}

export function handleTimesUp({
  correctAnswer,
  setTimerState,
  userAnswer,
  setshouldSubmit,
}: {
  setshouldSubmit: Dispatch<SetStateAction<boolean>>;
  setTriviaUser?: Dispatch<SetStateAction<TUser>>;
  userAnswer: string;
  setTimerState: TSetTimerState;
  correctAnswer: string;
}) {
  // display correct answer if user did not click any button
  if (!userAnswer) {
    // animate correct answer
    const el = document.getElementById(correctAnswer);
    el?.style.setProperty("--animate-duration", "1s");
    el?.classList.add("animate__rubberBand");

    setshouldSubmit(true);
  }

  setTimerState("ended");
}

export async function handleUserAnswer({
  i,
  value,
  setUserAnswer,
  setAnswerFeedback,
  correctAnswer,
  answers,
  setTimerState,
  setshouldSubmit,
}: IHandleUserAnswerProps) {
  setTimerState("ended");

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
      ) : null;
    })
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

  setshouldSubmit(true);

  if (storageAvailable()) {
    localStorage.setItem("fetchNewQuestions", "true");
  }
}

export function handleNextQuestion({
  currentAction,
  router,
  setQuestionIndex,
}: {
  currentAction: string;
  router: AppRouterInstance;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
}) {
  switch (currentAction) {
    case "View Progress":
      router.push("/stats");
      break;

    default:
      setQuestionIndex((state) => state + 1);
      break;
  }
}
