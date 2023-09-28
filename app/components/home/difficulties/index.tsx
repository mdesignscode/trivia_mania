"use client";
import storageAvailable from "@/components/localStorageDetection";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../store";
import RenderDifficulties from "./renderDifficulties";

export type TDifficultyChoice = { [key: string]: boolean };

function Difficulties() {
  const { difficulty, setDifficulty, getQuestionStats } =
    useContext(HomeContext);

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
    if (storageAvailable()) {
      const prevDiff = localStorage.getItem("difficulty");
      if (prevDiff) {
        setDifficultyChoice((state) => ({
          ...state,
          [prevDiff]: true,
        }));
        setDifficulty(prevDiff);
      }
    }
  }, []);

  return <RenderDifficulties {...{ difficultyChoice, handleDifficulty }} />;
}

export default Difficulties;
