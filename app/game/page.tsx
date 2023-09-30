/* Fetches a list of questions based on search params */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import RenderQuestions from "./components/renderQuestions";
import { GameProvider } from "./components/store";

export default function GamePage() {
  const params = useSearchParams();

  const difficulty = params.get("difficulty") || "";
  const categoriesString = params.get("categories");
  const categories = categoriesString ? categoriesString.split(",") : [];


  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}questions/play`;

    const { data } = await axios.post(url, { difficulty, categories });

    return data;
  }

  const { data } = useQuery({
    queryKey: ["play"],
    queryFn: getQuestions,
    initialData: [],
  });

  return (
    <GameProvider questions={data}>
      <RenderQuestions />
    </GameProvider>
  );
}
