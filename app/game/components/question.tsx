"use client";

import { GlobalContext } from "@/app/context/globalContext";
import { classNames } from "@/components/navigation/desktop";
import { Button } from "@/components/styledComponents";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import QuestionControls from "./QuestionControls";
import {
  TTimerState,
  handleTimesUp,
  handleUserAnswer,
} from "./QuestionHandlers";
import useGameStore from "./store";
import Timer from "./timerCountdown";
import useSubmitAnsweredQuestion from "@/hooks/submitAnsweredQuestion";

export const colorMap: { [key: string]: string } = {
  easy: "green",
  medium: "gold",
  hard: "red",
};

interface IQuestionProps {
  questionIndex: number;
  index: number;
  question: NonNullable<TQuestion>;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
}

export default function Question({
  questionIndex,
  index,
  question: { answers, category, correctAnswer, difficulty, question, id },
  setQuestionIndex,
}: IQuestionProps) {
  const [answerFeedback, setAnswerFeedback] = useState<(JSX.Element | null)[]>([
      null,
      null,
      null,
      null,
    ]),
    [timerState, setTimerState] = useState<TTimerState>("started"),
    [userAnswer, setUserAnswer] = useState(""),
    router = useRouter(),
    [currentAction] = useState(
      (index % 5) ? "Next Question" : "View Progress"
    ),
    { setTriviaUser, storageIsAvailable } =
      useContext(GlobalContext),
    { setshouldSubmit } = useSubmitAnsweredQuestion({
      answeredCorrect: userAnswer === correctAnswer,
      question: { answers, category, correctAnswer, difficulty, question, id },
    });

  useEffect(() => {
    if (storageIsAvailable) {
      localStorage.setItem("fetchNewQuestions", "false");
    }
  }, [storageIsAvailable]);

  return (
    <Transition
      show={questionIndex === index}
      enter="transform transition duration-[400ms] delay-500"
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95"
      className="border-2 dark:border-light rounded-lg col gap-4 p-4 md:text-lg"
      style={{ minWidth: 320, maxWidth: 580 }}
    >
      <div className="flex justify-between">
        <p>{category}</p>
        <p style={{ color: colorMap[difficulty] }}>{difficulty}</p>
      </div>

      <Timer
        handleTimesUp={() =>
          handleTimesUp({
            setTriviaUser,
            userAnswer,
            correctAnswer,
            setTimerState,
            setshouldSubmit,
          })
        }
        timerState={timerState}
      />

      <strong>{question}</strong>

      <section
        aria-label="Question answers"
        className="grid grid-cols-2 grid-rows-2 gap-4"
      >
        {answers.map((entity, i) => {
          const answer = decodeHTMLEntities(entity);
          return (
            <Button
              parentStyles="self-center"
              className={classNames(
                "flex w-full justify-center gap-2 items-center animate__animated",
                timerState === "ended" ? "cursor-not-allowed" : ""
              )}
              onClick={async () => {
                await handleUserAnswer({
                  setshouldSubmit,
                  setTriviaUser,
                  setTimerState,
                  value: entity,
                  setUserAnswer,
                  setAnswerFeedback,
                  questionIndex,
                  answers: answers,
                  i,
                  correctAnswer,
                  router,
                });
              }}
              key={answer}
              id={answer}
              disabled={timerState === "ended"}
              primary={
                !userAnswer &&
                timerState === "ended" &&
                entity === correctAnswer
              }
              testid={answer}
            >
              {answerFeedback[i] && (
                <span
                  data-testid={`feedback-${
                    answer === correctAnswer ? "correct" : "incorrect"
                  }-${i}`}
                >
                  {answerFeedback[i]}
                </span>
              )}
              <p>{decodeHTMLEntities(answer)}</p>
            </Button>
          );
        })}
      </section>

      <QuestionControls
        timerState={timerState}
        setQuestionIndex={setQuestionIndex}
        currentAction={currentAction}
      />

      <audio id="success">
        <source src="/success.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio id="error">
        <source src="/error.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Transition>
  );
}

export function decodeHTMLEntities(text: string): string {
  const element = document.createElement("div");
  element.innerHTML = text;
  return element.textContent || "";
}
