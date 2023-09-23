"use client";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Button } from "@/components/styledComponents";
import Loading from "app/loading";
import { HomeContext } from "./store";

function Difficulties() {
  const {
    difficulty,
    setDifficulty,
    getQuestionStats,
    fetchingDifficulty,
    difficultyStats,
  } = useContext(HomeContext);

  const [difficultyChoice, setDifficultyChoice] = useState<Array<boolean>>([
    false,
    false,
    false,
    false,
  ]);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -5 },
  };

  function handleDifficulty(index: number, value: string) {
    setDifficultyChoice((state: Array<boolean>) =>
      state.map((_, i) => {
        return i === index ? (difficulty ? false : true) : false;
      })
    );

    const seek = difficulty ? "" : value;
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
            {Object.keys(difficultyStats).map((stat, i) => {
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
                      handleDifficulty(i, value);
                    }}
                    $primary={difficultyChoice[i]}
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
