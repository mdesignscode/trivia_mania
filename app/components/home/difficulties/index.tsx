"use client";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../store";
import RenderDifficulties from "./renderDifficulties";
import useInitialStats from "../inititialStats";

export type TDifficultyChoice = { [key: string]: boolean };

function Difficulties() {
  // get context
  const { difficulty, setDifficulty, getQuestionStats } =
    useContext(HomeContext);
  const { previousDifficulty } = useInitialStats();

  // set local state
  const [difficultyChoice, setDifficultyChoice] = useState<TDifficultyChoice>({
    easy: false,
    medium: false,
    hard: false,
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
      return newState;
    });

    const seek = difficulty ? (difficulty === value ? "" : value) : value;
    setDifficulty(seek);

    getQuestionStats(seek);
  }

  useEffect(() => {
    if (previousDifficulty) {
      setDifficultyChoice((state) => ({
        ...state,
        [previousDifficulty]: true,
      }));
      setDifficulty(previousDifficulty)
    }
  }, [previousDifficulty]);

  return <RenderDifficulties {...{ difficultyChoice, handleDifficulty }} />;
}

export default Difficulties;
