"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { HomeContext } from "@/context/homeContext";
import {
  useContext
} from "react";
import RenderDifficulties from "./renderDifficulties";

export default function Difficulties() {
  // get context
  const {
    getQuestionStats,
    setCurrentUI,
    currentUI: { difficulties },
  } = useContext(HomeContext);
  const {
    playFilters: { difficulty },
    setPlayFilters,
    setDifficultyChoice,
  } = useContext(GlobalContext);

  function handleDifficulty(value: string) {
    // fetch questions based on clicked difficulty
    const seek = difficulty ? (difficulty === value ? "" : value) : value;

    setDifficultyChoice((state) => {
      const newState: Record<string, boolean> = {};
      for (const diffKey of Object.keys(state)) {
        newState[diffKey] = diffKey === value ? !state[diffKey] : false;
      }
      return newState;
    });

    // update difficulty
    setPlayFilters((state) => ({
      ...state,
      difficulty: seek,
    }));

    // display categories UI
    setCurrentUI((state) => ({
      ...state,
      categories: true,
    }));

    getQuestionStats(seek);
  }

  return (
    difficulties && <RenderDifficulties handleDifficulty={handleDifficulty} />
  );
}
