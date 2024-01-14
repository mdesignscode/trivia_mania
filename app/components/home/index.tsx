/* Responsible for rendering home components */
"use client";
import { HomeContext } from "@/context/homeContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import { classNames } from "../navigation/desktop";
import Categories from "./categories";
import Difficulties from "./difficulties";
import Play from "./play";
import Welcome from "./welcome";
import useWindowWidth from "@/hooks/windowWidth";

export default function HomePage() {
  const { showCategories } = useContext(HomeContext);
  const isMobile = useWindowWidth();

  const showingCategoriesStyles = classNames(
    "justify-between items-center h-full",
    isMobile ? "col" : "flex"
  );

  const transitionUI = showCategories
      ? { opacity: 0, top: 0, right: isMobile ? 0 : "200%", scale: 2 }
      : { opacity: 1, top: "90%", right: 0, scale: 2 },
    transitionUIStyles = classNames(
      "bg-accent absolute -z-10 rounded-full",
      showCategories ? " w-10/12 h-full" : "w-64 h-64"
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full relative overflow-hidden"
    >
      <div className="col w-full h-full" data-testid="home-container">
        <Welcome />

        {showCategories ? (
          <div className={showingCategoriesStyles}>
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className={classNames(
                "col items-center justify-center bg-accent",
                isMobile
                  ? "rounded-b-3xl w-full h-2/5 py-4 overflow-y-auto"
                  : "rounded-r-3xl h-full w-1/4"
              )}
            >
              <Difficulties />
              <Play />
            </motion.div>

            <Categories />
          </div>
        ) : (
          <>
            <Difficulties />

            <Categories />
          </>
        )}

        <motion.div
          initial={{ opacity: 0, top: 0, right: "100%", scale: 10 }}
          animate={transitionUI}
          transition={{ duration: 2.5 }}
          className={transitionUIStyles}
        />
      </div>
    </motion.div>
  );
}
