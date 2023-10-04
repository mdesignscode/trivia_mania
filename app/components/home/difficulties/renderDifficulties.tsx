"use client";
import { buttonVariants } from "@/components/store";
import { Button } from "@/components/styledComponents";
import useInitialStats from "@/hooks/inititialStats";
import Loading from "app/loading";
import { motion } from "framer-motion";
import { TDifficultyChoice } from ".";

interface RenderDifficultiesProps {
  difficultyChoice: TDifficultyChoice;
  handleDifficulty: (value: string) => void;
}

export default function RenderDifficulties({
  difficultyChoice,
  handleDifficulty,
}: RenderDifficultiesProps) {
  const { difficultiesLoading, difficultyStats } = useInitialStats();

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center col gap-3">
        <h1 className="text-xl">Choose difficulty</h1>

        {!difficultiesLoading ? (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.keys(difficultyChoice).map((stat) => {
                return (
                  <motion.span
                    key={stat}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="hover"
                  >
                    <Button
                      onClick={() => {
                        const value = stat === "all difficulties" ? "" : stat;
                        handleDifficulty(value);
                      }}
                      $primary={difficultyChoice[stat]}
                    >
                      {stat} ({difficultyStats[stat]})
                    </Button>
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}
