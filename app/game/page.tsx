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

export default function GamePage() {
  const params = useSearchParams()

  useFetchQuestions({
    difficulty: params.get(DIFFICULTY) || "all difficulties",
    categories: params.get(CATEGORIES) || "",
  });

  return (
    <>
      <RenderQuestions />
      <Start />
    </>
  );
}
