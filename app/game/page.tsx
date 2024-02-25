/* Fetches a list of questions based on search params */
"use client";
import useFetchQuestions from "@/hooks/fetchQuestions";
import {
  CATEGORIES,
  DIFFICULTY
} from "@/utils/localStorage_utils";
import { useSearchParams } from "next/navigation";
import RenderQuestions from "./components";
import Start from "./components/start";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/globalContext";

export default function GamePage() {
  const params = useSearchParams(),
    { storageIsAvailable } = useContext(GlobalContext)

  useFetchQuestions({
    difficulty: params.get(DIFFICULTY) || "all difficulties",
    categories: params.get(CATEGORIES) || "",
  });

  useEffect(() => {
    if (storageIsAvailable) {
      localStorage.setItem("gamePageMounted", "true")
    }

    return () => {
      localStorage.setItem("gamePageMounted", "false");
    }
  }, [storageIsAvailable]);

  return (
    <>
      <RenderQuestions />
      <Start />
    </>
  );
}
