/* Fetches a list of questions based on search params */
"use client";
import { GameProvider } from "@/context/gameContext";
import { GlobalContext } from "@/context/globalContext";
import { CATEGORIES, DIFFICULTY, NEW_PARAMS } from "@/utils/localStorage_utils";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import RenderQuestions from "./components/renderQuestions";
import Start from "./components/start";

export default function GamePage() {
  const params = useSearchParams();
  const {
    setPlayFilters,
    playFilters: { categories, difficulty },
  } = useContext(GlobalContext);

  useEffect(() => {
    const localFlag = localStorage.getItem(NEW_PARAMS);
    if (localFlag) return;

    // get search filters from search params
    const difficultyString = params.get(DIFFICULTY) || "";
    const categoriesString = params.get(CATEGORIES) || "";
    if (difficultyString !== difficulty && categoriesString !== categories) {
      setPlayFilters(() => ({
        difficulty: difficultyString,
        categories: categoriesString,
      }));
      localStorage.setItem(NEW_PARAMS, "true");
    }
  }, [categories, difficulty, params, setPlayFilters]);

  return (
    <GameProvider>
      <>
        <RenderQuestions />
        <Start />
      </>
    </GameProvider>
  );
}
