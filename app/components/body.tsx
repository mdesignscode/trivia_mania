/* Renders an intro animation while preparing application resources */
"use client";

import { GlobalContext } from "@/context/globalContext";
import "animate.css";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Navigation from "./navigation";

export default function Body({ children }: { children: React.ReactNode }) {
  const [animatedText, setAnimatedText] = useState<JSX.Element[]>([]);
  const [animateText, setAnimateText] = useState(false);
  const [textTransition, setTextTransition] = useState<Record<string, any>>({
    opacity: 1,
  });
  const [transitionUI, setTransitionUI] = useState({
    opacity: 1,
    bottom: "100%",
    right: "100%",
  });
  const { pageReady, setPageReady } = useContext(GlobalContext);

  useEffect(() => {
    // create a list of letters to animate
    const letters = "Trivia Mania".split("").map((letter, i) => (
      <span
        key={`${letter}_${i}`}
        className="animated-letter animate__animated"
      >
        {letter}
      </span>
    ));
    setAnimatedText(letters);

    setTimeout(() => {
      setAnimateText(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (animateText) {
      // find list in DOM
      const animatedLetters = document.querySelectorAll(".animated-letter");
      Array.from(animatedLetters).forEach((letter, i) => {
        const animationDelay = i * 0.25;

        const letterElement = letter as HTMLElement;

        // add animation class and delay
        letterElement.style.animationDelay = `${animationDelay}s`;
        letterElement.classList.add("animate__bounceInDown");
      });

      // listen for last element's animation end
      Array.from(animatedLetters)
        .at(-1)
        ?.addEventListener("animationend", () => {
          setTransitionUI((state) => ({
            ...state,
            scale: 0,
            right: "200%",
          }));
          setTextTransition({
            opacity: 0,
            x: 200,
          });
          setTimeout(() => {
            setPageReady(true);
          }, 1000);
        });
    }
  }, [animateText, setPageReady]);

  return pageReady ? (
    <>
      <Navigation />

      <div className="flex-1 overflow-y-auto">{children}</div>
    </>
  ) : (
    <>
      {animateText && (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={textTransition}
          transition={{ duration: 1 }}
          className="w-full gap-3 text-7xl h-full flex justify-center items-center"
        >
          {animatedText}
        </motion.div>
      )}
      <motion.div
        id="page-ready-animation"
        initial={{ opacity: 0, bottom: 0, right: 0, scale: 10 }}
        animate={transitionUI}
        transition={{ duration: 2.5 }}
        className="bg-accent absolute -z-10 rounded-full w-64 h-64"
      />
    </>
  );
}
