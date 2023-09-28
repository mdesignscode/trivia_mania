"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext } from "react";
import storageAvailable from "../localStorageDetection";
import { buttonVariants } from "../store";
import { HomeContext } from "./store";

export default function Play() {
  const { difficulty, categories } = useContext(HomeContext);
  function handlePlay() {
    if (storageAvailable()) {
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.span
        variants={buttonVariants}
        whileHover="hover"
        whileTap="hover"
      >
        <Link
          href={encodeURI(
            `/game?difficulty=${difficulty}&categories=${categories.join(",")}`
          )}
        >
          <button className="w-full h-full start-button" onClick={handlePlay}>
            Start Playing
          </button>
        </Link>
      </motion.span>
    </motion.div>
  );
}
