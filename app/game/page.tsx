"use client";
import { MouseEvent, useState } from "react";
import SelectCategory from "./components/selectCategory";
import CategoryQuestions from "./components/categoryQuestions";

export default function GamePage() {
  const [category, setCategory] = useState("");

  const handleCategorySelect = (e: MouseEvent<HTMLButtonElement>) => {
    setCategory((e.target as HTMLButtonElement).innerHTML)
  }

  return (
    <div className="game-page px-8 pt-4 flex-1">
      <div className="w-3/5 h-4/5 mx-auto">
        <SelectCategory category={category} handleCategorySelect={handleCategorySelect} />
        <CategoryQuestions category={category} />
      </div>
    </div>
  );
}
