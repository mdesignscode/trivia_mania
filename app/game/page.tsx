/* Fetches a list of questions based on search params */
"use client";
import { GameProvider } from "@/context/gameContext";
import { GlobalContext } from "@/context/globalContext";
import {
  CATEGORIES,
  DIFFICULTY,
  QUESTIONS_LIST,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import RenderQuestions from "./components";
import Start from "./components/start";
import useFetchQuestions from "@/hooks/fetchQuestions";
import useGameStore from "./components/store";

export default function GamePage() {
  const params = useSearchParams();
  const {
    setPlayFilters,
    playFilters: { categories, difficulty },
    newFilters,
    setNewFilters,
    storageIsAvailable,
  } = useContext(GlobalContext);
  const [pageReady, setPageReady] = useState(false),
    { questions } = useGameStore();

  useFetchQuestions({
    difficulty: params.get(DIFFICULTY) || "all difficulties",
    categories: params.get(CATEGORIES) || "",
  });

  return (
    <>
      <RenderQuestions />
      {/* <Start /> */}
    </>
  );
}
