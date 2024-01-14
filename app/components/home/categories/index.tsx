/* Handles logic for categories components */
"use client";
import { GlobalContext } from "@/context/globalContext";
import { useContext } from "react";
import RenderCategories from "./renderCategories";

export default function Categories() {
  const { setPlayFilters, setCategoryChoice } = useContext(GlobalContext);

  function handleCategories(index: number, value: string) {
    setCategoryChoice((state) => {
      const newState = [...state];
      newState[index] = !state[index];
      return newState;
    });

    setPlayFilters((state) => {
      const categories = state.categories ? state.categories.split(",") : [];

      const valueIndex = categories.indexOf(value);
      const newCategories =
        valueIndex === -1
          ? [...categories, value]
          : categories.filter((category) => category !== value);

      return {
        ...state,
        categories: newCategories.join(","),
      };
    });
  }

  return (
    <RenderCategories
      {...{
        handleCategories,
        setCategoryChoice,
      }}
    />
  );
}
