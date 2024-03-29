"use client";
import { classNames } from "@/components/navigation/desktop";
import { Button } from "@/components/styledComponents";
import { GlobalContext } from "@/context/globalContext";
import { HomeContext } from "@/context/homeContext";
import useWindowWidth from "@/hooks/windowWidth";
import { motion } from "framer-motion";
import { useContext } from "react";

interface RenderDifficultiesProps {
  handleDifficulty: (value: string) => void;
}

export default function RenderDifficulties({
  handleDifficulty,
}: RenderDifficultiesProps) {
  const {
    currentUI: { difficulties },
    showCategories,
    difficultyStats,
  } = useContext(HomeContext);
  const { difficultyChoice } = useContext(GlobalContext);
  const isMobile = useWindowWidth();

  const difficultyTransitionUI = difficulties
    ? showCategories
      ? { opacity: 1, x: 0 }
      : { opacity: 1, y: 100 }
    : { opacity: 0, y: 100 };

  const difficultiesStyles = classNames(
    "flex gap-2 justify-center",
    showCategories ? (isMobile ? "flex-wrap" : "col") : "flex-wrap"
  );

  return (
    <motion.div
      initial={
        showCategories ? { x: -200, opacity: 0 } : { y: 200, opacity: 0 }
      }
      animate={difficultyTransitionUI}
      exit={{ x: 0, opacity: 0 }}
      transition={{ duration: 1.5, delay: showCategories ? 1.5 : 0 }}
    >
      <div
        className="text-center col gap-3"
        data-testid="render-difficulties-container"
      >
        <h1 className="text-xl">Choose difficulty</h1>

        <div className={difficultiesStyles}>
          {Object.keys(difficultyChoice).map((stat) => {
            return (
              <Button
                onClick={() => handleDifficulty(stat)}
                testid={stat}
                primary={difficultyChoice[stat]}
                key={stat}
                showCategories={showCategories}
              >
                {stat} ({difficultyStats[stat]})
              </Button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
