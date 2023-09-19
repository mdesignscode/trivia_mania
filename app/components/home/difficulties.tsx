"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/styledComponents";
import Loading from "app/loading";

interface IDifficultiesProps {
  setDifficulty: Function;
  getQuestionStats: Function;
  fetchingDifficulty: boolean;
  difficultyStats: Record<string, number>;
}

function Difficulties({
  setDifficulty,
  getQuestionStats,
  fetchingDifficulty,
  difficultyStats,
}: IDifficultiesProps) {
  const [difficultyChoice, setDifficultyChoice] = useState<Array<boolean>>([
    false,
    false,
    false,
  ]);
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -5 },
  };

  function handleDifficulty(index: number, value: string) {
    setDifficultyChoice((state: Array<boolean>) =>
      state.map((_, i) => {
        return i === index ? true : false;
      })
    );
    setDifficulty(value);

    getQuestionStats(value);
  }

  return (
    <motion.div
    // initial={{ opacity: 0, scale: 0.5 }}
    // animate={{ opacity: 1, scale: 1 }}
    // exit={{ opacity: 0, scale: 0.5 }}
    // transition={{ duration: 0.5 }}
    >
      <div className="text-center flex flex-col gap-3">
        <h1>Choose difficulty</h1>

        {!fetchingDifficulty ? (
          <div className="flex gap-2 flex-wrap justify-center">
            {Object.keys(difficultyStats).map((stat, i) => {
              return (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="hover"
                  onClick={() => setIsHovered(!isHovered)}
                >
                  <Button
                    key={stat}
                    onClick={() => {
                      const value = stat === "all difficulties" ? "" : stat;
                      handleDifficulty(i, value);
                    }}
                    $primary={difficultyChoice[i]}
                  >
                    {stat} ({difficultyStats[stat]})
                  </Button>
                </motion.button>
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
