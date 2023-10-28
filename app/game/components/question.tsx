/* Renders a question */
"use client";
import { Button, QuestionBox } from "@/components/styledComponents";
import { GameContext } from "@/context/gameContext";
import { IQuestion } from "@/models/interfaces";
import { Transition } from "@headlessui/react";
import { Fragment, MouseEventHandler, ReactNode, useContext } from "react";
import Timer from "./timerCountdown";

export interface IRenderQuestion {
  questionObj: IQuestion;
  index: number;
  handleUserAnswer: Function;
  handleTimesUp: Function;
  error: string;
  CTA: string;
  timesUp: boolean;
  handleNextQuestion: MouseEventHandler<HTMLButtonElement>;
  handleViewProgress: MouseEventHandler<HTMLButtonElement>;
  userAnswer: string;
  answerFeedback: ReactNode[];
  timerHasStarted: boolean;
}

export default function RenderQuestion({
  questionObj: { category, answers, correctAnswer, question, difficulty },
  index,
  handleTimesUp,
  handleUserAnswer,
  error,
  CTA,
  timesUp,
  handleNextQuestion,
  handleViewProgress,
  userAnswer,
  answerFeedback,
  timerHasStarted
}: IRenderQuestion) {
  const { questionIndex } = useContext(GameContext);
  const colorMap: { [key: string]: string } = {
    easy: "green",
    medium: "gold",
    hard: "red",
  };

  return (
    <Transition
      as={Fragment}
      show={questionIndex === index}
      enter="transform transition duration-[400ms] delay-500"
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95"
    >
      <QuestionBox
        className="question col gap-7 rounded-lg p-6"
        data-testid="question-container"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl">{category}</h1>

          <p
            className="text-xl"
            style={{
              color: colorMap[difficulty],
            }}
          >
            {difficulty}
          </p>
        </div>

        <h1 className="text-2xl">{decodeHTMLEntities(question)}</h1>

        <Timer
          handleTimesUp={handleTimesUp}
          timerHasStarted={timerHasStarted}
        />

        <div className="question_options grid grid-cols-2 grid-rows-2 gap-4">
          {answers.map((entity, i) => {
            const answer = decodeHTMLEntities(entity);
            return (
              <Button
                className="flex w-full justify-center gap-2 items-center animate__animated"
                onClick={() => handleUserAnswer(answer, i)}
                key={answer}
                id={answer}
                disabled={timesUp}
                style={{
                  cursor: !timesUp ? "pointer" : "not-allowed",
                }}
                primary={!userAnswer && timesUp && answer === correctAnswer}
              >
                <span>{answerFeedback[i]}</span>
                <p>{decodeHTMLEntities(answer)}</p>
              </Button>
            );
          })}
        </div>

        {timesUp && (
          <>
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              primary={true}
            >
              {CTA}
            </Button>

            {CTA === "Continue Playing" && (
              <Button
                onClick={handleViewProgress}
                className="w-full"
                primary={true}
              >
                View Progress
              </Button>
            )}
          </>
        )}
        {error && <div>{error as string}</div>}
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

export function decodeHTMLEntities(text: string): string {
  const element = document.createElement("div");
  element.innerHTML = text;
  return element.textContent || "";
}
