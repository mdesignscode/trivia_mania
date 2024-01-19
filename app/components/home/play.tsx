"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { CATEGORIES, DIFFICULTY, NEW_PARAMS } from "@/utils/localStorage_utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext } from "react";
import { Button } from "../styledComponents";
import { HomeContext } from "@/app/context/homeContext";

export default function Play() {
  const {
    storageIsAvailable,
    setPlayFilters,
    playFilters: { difficulty, categories },
    playUrl,
  } = useContext(GlobalContext);
  const { showCategories } = useContext(HomeContext);

  function handlePlay() {
    // update filters in local storage new filters different
    if (storageIsAvailable) {
      const localDifficulty = localStorage.getItem(DIFFICULTY);
      const localCategories = localStorage.getItem(CATEGORIES);

      if (localDifficulty === difficulty && localCategories === categories) {
        return;
      } else {
        // new filters are different
        localStorage.setItem(DIFFICULTY, difficulty);
        localStorage.setItem(CATEGORIES, categories);

        // notify game page to fetch new questions
        localStorage.setItem(NEW_PARAMS, "true");

        // update filters in state
        setPlayFilters(() => ({
          difficulty,
          categories,
        }));
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ delay: 1.5, duration: 1.5 }}
    >
      <Link href={playUrl} data-testid="play-link">
        <Button
          showCategories={showCategories}
          cta={true}
          onClick={handlePlay}
          testid="play-button"
        >
          Start Playing
        </Button>
      </Link>
    </motion.div>
  );
}
