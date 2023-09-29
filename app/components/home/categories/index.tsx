/* Handles logic for categories components */
"use client";
import { GlobalContext } from "app/store";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../store";
import RenderCategories from "./renderCategories";

function Categories() {
  const { categoryStats, fetchingCategories, setCategories } =
    useContext(HomeContext);
  const { storageIsAvailable } = useContext(GlobalContext);
  const [categoryChoice, setCategoryChoice] = useState<boolean[]>(
    Object.keys(categoryStats).map(() => false)
  );

  // set previous categories if available
  useEffect(() => {
    if (storageIsAvailable) {
      const prevCategories = localStorage.getItem("categories");

      if (prevCategories) {
        const preferences = JSON.parse(prevCategories) as string[];

        if (preferences.length > 0) {
          const newState: Record<string, boolean> = {};
          Object.keys(categoryStats).forEach((category) => {
            newState[category] = preferences.includes(category) ? true : false;
          });

          setCategories(preferences);
          setCategoryChoice(Object.values(newState));
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
        fetchingCategories,
        categoryChoice,
        handleCategories,
        setCategoryChoice,
      }}
    />
  );
}

export default Categories;
