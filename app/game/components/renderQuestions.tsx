/* Renders a list of questions */
"use client";
import { motion } from "framer-motion";
import { useContext } from "react";
import QuestionComponent from ".";
import { GameContext } from "./store";
import HandleUnsavedProgress from "@/components/handleUnsavedProgress";

export default function RenderQuestions({
  categories,
  difficulty,
}: {
  categories: string;
  difficulty: string;
}) {
  const { questions, questionIndex, questionsLength, poolIndex } =
    useContext(GameContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex-1 flex justify-center"
    >
      {isNaN(questionIndex) ? (
        <div className="col gap-2 mt-6 text-2xl">
          <h1 className="text-3xl">You have finished all questions for</h1>

          <div className="flex gap-3">
            <p>Difficulty:</p>
            <p>{difficulty}</p>
          </div>

          <div className="flex gap-3">
            <p>Categories:</p>
            <p>{categories}</p>
          </div>

          <HandleUnsavedProgress />
        </div>
      ) : (
        <div className="col justify-center items-center gap-4 max-w-3xl mx-8 h-full">
          <h1 className="text-2xl">
            Question {questionIndex} of {questionsLength}
          </h1>
          {questions.map((question, i) => {
            return (
              <QuestionComponent
                index={i + poolIndex + 1}
                questionObj={question}
                key={question.id}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
