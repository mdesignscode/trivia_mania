/* Renders categories components */
"use client";
import Loading from "app/loading";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "../store";
import DisplayCategories from "./displayCategories";
import DisplayControls from "./displayControls";
import storageAvailable from "@/components/localStorageDetection";

function Categories() {
  const { categoryStats, fetchingCategories, setCategories, categories } =
    useContext(HomeContext);
  const [showMore, setShowMore] = useState(false);
  const [categoryChoice, setCategoryChoice] = useState<boolean[]>(
    Object.keys(categoryStats).map(() => false)
  );

  // set previous categories if available
  useEffect(() => {
    if (storageAvailable()) {
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
  }, [categoryStats]);

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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center col gap-3">
        <h1 className="text-xl">Choose Categories</h1>

        {!fetchingCategories ? (
          <div className="col gap-3">
            {/* display categories */}
            <DisplayCategories
              {...{
                categoryChoice,
                showMore,
                handleCategories,
              }}
            />

            {/* categories display controls */}
            <DisplayControls
              {...{
                showMore,
                setShowMore,
                setCategoryChoice,
              }}
            />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}

export default Categories;
