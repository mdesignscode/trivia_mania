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
  CTA: string;
  timesUp: boolean;
  handleNextQuestion: MouseEventHandler<HTMLButtonElement>;
  handleViewProgress: MouseEventHandler<HTMLButtonElement>;
  userAnswer: string;
  answerFeedback: ReactNode[];
  timerHasStarted: boolean;
  handleContinueLater: MouseEventHandler<HTMLButtonElement>;
}

export default function RenderQuestion({
  questionObj: { category, answers, correctAnswer, question, difficulty },
  index,
  handleTimesUp,
  handleUserAnswer,
  CTA,
  timesUp,
  handleNextQuestion,
  handleViewProgress,
  userAnswer,
  answerFeedback,
  timerHasStarted,
  handleContinueLater,
}: IRenderQuestion) {
  const { questionIndex, error, hasSubmit } = useContext(GameContext);
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
                onClick={() => handleUserAnswer(entity, i)}
                key={answer}
                id={answer}
                disabled={timesUp}
                style={{
                  cursor: !timesUp ? "pointer" : "not-allowed",
                }}
                primary={!userAnswer && timesUp && answer === correctAnswer}
                testid={answer}
              >
                <span
                  data-testid={`feedback-${
                    answer === correctAnswer ? "correct" : "incorrect"
                  }-${i}`}
                >
                  {answerFeedback[i]}
                </span>
                <p>{decodeHTMLEntities(answer)}</p>
              </Button>
            );
          })}
        </div>

        <Button
          testid="continue-later-button"
          onClick={handleContinueLater}
          className="w-full"
          disabled={hasSubmit}
        >
          Continue Later
        </Button>

        {timesUp && (
          <>
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              primary={true}
              disabled={hasSubmit}
            >
              {CTA}
            </Button>

            {CTA === "Continue Playing" && (
              <Button
                onClick={handleViewProgress}
                className="w-full"
                primary={true}
                disabled={hasSubmit}
              >
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

export function decodeHTMLEntities(text: string): string {
  const element = document.createElement("div");
  element.innerHTML = text;
  return element.textContent || "";
}
