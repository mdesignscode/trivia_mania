/* Handles logic for categories components */
"use client";
import { GlobalContext } from "@/app/store";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../store";
import RenderCategories from "./renderCategories";

function Categories() {
  const {
    categoryStats,
    setCategories,
    setFetchingCategories,
  } = useContext(HomeContext);
  const { storageIsAvailable } = useContext(GlobalContext);
  const [categoryChoice, setCategoryChoice] = useState<boolean[]>(
    Object.keys(categoryStats).map(() => false)
  );

  // set previous categories if available
  useEffect(() => {
    if (
      storageIsAvailable &&
      Object.keys(categoryStats).length &&
      !categoryStats["all difficulties"]
    ) {
      setFetchingCategories(true);
      const prevCategories = localStorage.getItem("categories");

      if (prevCategories) {
        const preferences = prevCategories.split(",");

        if (preferences.length > 0) {
          const newState: Record<string, boolean> = {};
          Object.keys(categoryStats)
            .sort()
            .forEach((category) => {
              newState[category] = preferences.includes(category)
                ? true
                : false;
            });

          const newPreferences = Object.keys(newState).filter(
            (key) => !!newState[key]
          );

          setCategories(newPreferences);
          setCategoryChoice(Object.values(newState));
          setFetchingCategories(false);
        }
      }
    }
  }, [categoryStats, storageIsAvailable]);

  function handleCategories(index: number, value: string) {
    setCategoryChoice((state) => {
      const newState = [...state];
      newState[index] = !state[index];
      return newState;
    });

    setCategories((state) => {
      const valueIndex = state.indexOf(value);
      return valueIndex === -1
        ? [...state, value]
        : state.filter((category) => category !== value);
    });
  }

  return (
    <RenderCategories
      {...{
        categoryChoice,
        handleCategories,
        setCategoryChoice,
      }}
    />
  );
}

export default Categories;
