"use client";
import { Button } from "@/components/styledComponents";
import Loading from "app/loading";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { buttonVariants } from "../store";
import { HomeContext } from "./store";

type TDifficultyChoice = { [key: string]: boolean };

function Difficulties() {
  const {
    difficulty,
    setDifficulty,
    getQuestionStats,
    fetchingDifficulty,
    difficultyStats,
  } = useContext(HomeContext);

  const [difficultyChoice, setDifficultyChoice] = useState<TDifficultyChoice>({
    easy: false,
    hard: false,
    medium: false,
    "all difficulties": false,
  });

  function handleDifficulty(value: string) {
    setDifficultyChoice((state) => {
      const newState: TDifficultyChoice = {};
      Object.keys(state).forEach((difficulty) => {
        if (difficulty === value) {
          newState[difficulty] = !state[difficulty];
        } else {
          newState[difficulty] = false;
        }
      });
      return newState
    });

    const seek = difficulty ? (difficulty === value ? "" : value) : value;
    setDifficulty(seek);

    getQuestionStats(seek);
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center col gap-3">
        <h1 className="text-xl">Choose difficulty</h1>

        {!fetchingDifficulty ? (
          <div className="flex gap-2 flex-wrap justify-center">
            {Object.keys(difficultyStats).map((stat) => {
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
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}

export default Difficulties;
