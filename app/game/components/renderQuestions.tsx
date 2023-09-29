"use client";
import { IQuestion, IUserStats } from "@/models/interfaces";
import Loading from "app/loading";
import { motion } from "framer-motion";
import QuestionComponent from ".";

// Create an interface for RenderQuestions props
interface RenderQuestionsProps {
  data: IQuestion[];
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  updateProgress: (question: IQuestion, answer: string) => void;
  submitProgress: (id: string) => Promise<any>;
  playerStats: IUserStats;
}

export default function RenderQuestions({
  data,
  questionIndex,
  setQuestionIndex,
  updateProgress,
  submitProgress,
  playerStats,
}: RenderQuestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex-1 flex justify-center"
    >
      <div className="col justify-center items-center gap-4 max-w-3xl mx-8 h-full">
        {data.length ? (
          <>
            <h1 className="text-2xl">
              Question {questionIndex} of {data.length}
            </h1>
            {data.map((question: IQuestion, i: number) => {
              return (
                <QuestionComponent
                  setIndex={setQuestionIndex}
                  questionNumber={questionIndex}
                  index={i + 1}
                  questionObj={question}
                  key={question.id}
                  questionsLength={data.length}
                  updateProgress={updateProgress}
                  submitProgress={submitProgress}
                  progress={playerStats}
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
