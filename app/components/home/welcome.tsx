/* Welcome screen */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { HomeContext } from "@/context/homeContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import { Button } from "../styledComponents";

export default function Welcome() {
  const {
    currentUI: { welcome },
    setCurrentUI,
    showCategories,
  } = useContext(HomeContext);
  const { playFilters: { difficulty } } = useContext(GlobalContext)

  function handleContinue() {
    setCurrentUI((state) => ({
      ...state,
      welcome: false,
      difficulties: true,
      categories: difficulty ? true : false
    }));
  }

  const transitionUI = welcome
    ? { opacity: 1, y: 100 }
    : showCategories
    ? { display: "none" }
    : { opacity: 0, y: -100 };

  return (
    welcome && (
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={transitionUI}
        transition={{ duration: 1.5, delay: welcome ? 1.5 : 0 }}
        className="text-center col items-center mx-auto"
        data-testid="welcome-container"
      >
        <h1 className="text-3xl md:text-5xl mb-3">Welcome to Trivia Mania</h1>
        <p className="text-xl mb-5">
          Test your knowledge with exciting trivia questions.
        </p>

        <Button
          testid="welcome-continue-button"
          onClick={handleContinue}
          primary={true}
          textSize="2xl"
        >
          Continue
        </Button>
      </motion.div>
    )
  );
}
