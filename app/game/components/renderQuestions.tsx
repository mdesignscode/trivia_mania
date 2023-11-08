/* Renders a list of questions */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import HandleUnsavedProgress from "@/components/handleUnsavedProgress";
import { GameContext } from "@/context/gameContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import Question from ".";

export default function RenderQuestions() {
  const {
    questions,
    questionIndex,
    questionsLength,
    poolIndex,
    startPlaying,
  } = useContext(GameContext);
  const {
    playFilters: { difficulty, categories },
  } = useContext(GlobalContext);

  return (
    startPlaying && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full flex-1 flex justify-center"
      >
        {isNaN(questionIndex) || questionIndex > questionsLength ? (
          <div
            className="col gap-2 mt-6 px-4 text-2xl"
            data-testid="all-questions-answered-container"
          >
            <h1 className="text-3xl">You have finished all questions for</h1>

            <div className="flex gap-3" data-testid="finished-difficulty">
              <p>Difficulty:{" "}</p>
              <p>{difficulty || "all difficulties"}</p>
            </div>

            <div className="flex gap-3" data-testid="finished-categories">
              <p>Categories:{" "}</p>
              <p>{categories || "all categories"}</p>
            </div>

            <HandleUnsavedProgress />
          </div>
        ) : (
          <div
            className="col justify-center items-center gap-4 max-w-3xl mx-8 h-full overflow-y-auto"
            data-testid="render-questions-container"
          >
            <h1 className="text-2xl">
              Question {questionIndex} of {questionsLength}
            </h1>
            {questions.map((question, i) => {
              return (
                <Question
                  index={i + poolIndex + 1}
                  questionObj={question}
                  key={question.id}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    )
  );
}
