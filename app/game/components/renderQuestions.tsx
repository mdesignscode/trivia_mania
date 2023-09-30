/* Renders a list of questions */
"use client";
import { IQuestion } from "@/models/interfaces";
import Loading from "app/loading";
import { motion } from "framer-motion";
import QuestionComponent from ".";
import { GameContext } from "./store";
import { useContext } from "react";

export default function RenderQuestions() {
  const { questions, questionIndex } = useContext(GameContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex-1 flex justify-center"
    >
      <div className="col justify-center items-center gap-4 max-w-3xl mx-8 h-full">
        {questions.length ? (
          <>
            <h1 className="text-2xl">
              Question {questionIndex} of {questions.length}
            </h1>
            {questions.map((question: IQuestion, i: number) => {
              return (
                <QuestionComponent
                  index={i + 1}
                  questionObj={question}
                  key={question.id}
                />
              );
            })}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}
