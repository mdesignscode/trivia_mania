/* Fetches a list of questions based on search params */
"use client";
import Loading from "app/loading";
import { useSearchParams } from "next/navigation";
import useFetchQuestionsList from "../hooks/fetchQuestionsList";
import RenderQuestions from "./components/renderQuestions";
import { GameProvider } from "./components/store";

export default function GamePage() {
  const params = useSearchParams();

  // get search filters from search params
  const difficultyString = params.get("difficulty");
  const difficulty = difficultyString || "";
  const categoriesString = params.get("categories");
  const categories = categoriesString ? categoriesString.split(",") : [];

  const {
    questionsPoolReady,
    questionsLength,
    questions,
    nextQuestionsSet,
    questionIndex,
    incrementIndex,
    poolIndex,
  } = useFetchQuestionsList(difficulty, categories);

  return !questionsPoolReady ? (
    <Loading />
  ) : (
    <GameProvider
      {...{
        questionsLength,
        questions,
        nextQuestionsSet,
        questionIndex,
        incrementIndex,
        poolIndex,
      }}
    >
      <RenderQuestions
        difficulty={difficultyString || "All difficulties"}
        categories={categoriesString || "All categories"}
      />
    </GameProvider>
  );
}
