/* Fetches a list of questions based on search params */
"use client";
import { GameProvider } from "@/context/gameContext";
import { GlobalContext } from "@/context/globalContext";
import {
  CATEGORIES,
  DIFFICULTY,
  NEW_PARAMS,
  QUESTIONS_LIST,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import RenderQuestions from "./components/renderQuestions";
import Start from "./components/start";

export default function GamePage() {
  const params = useSearchParams();
  const {
    setPlayFilters,
    playFilters: { categories, difficulty },
    newFilters,
    setNewFilters,
    storageIsAvailable,
  } = useContext(GlobalContext);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!storageIsAvailable) return;

    if (!pageReady) {
      if (!localStorage.getItem(QUESTIONS_LIST)) setNewFilters(true);

      // get search filters from search params
      const difficultyString = params.get(DIFFICULTY) || "";
      const categoriesString = params.get(CATEGORIES) || "";

      // set new params flag if play filters different from search params
      if (
        newFilters ||
        (difficultyString !== difficulty && categoriesString !== categories)
      ) {
        setNewFilters(true);
        clearQuestionData();

        // search filters should be new play filters
        setPlayFilters(() => ({
          difficulty: difficultyString,
          categories: categoriesString,
        }));
      }
      setPageReady(true);
    }
  }, [
    categories,
    difficulty,
    newFilters,
    pageReady,
    params,
    setNewFilters,
    setPlayFilters,
    storageIsAvailable,
  ]);

  return (
    pageReady && (
      <GameProvider>
        <>
          <RenderQuestions />
          <Start />
        </>
      </GameProvider>
    )
  );
}
