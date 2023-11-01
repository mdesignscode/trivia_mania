/* Fetch questions in background */
"use client";
import { motion } from "framer-motion";
import { GameContext } from "@/app/context/gameContext";
import { Button } from "@/components/styledComponents";
import { useContext } from "react";

export default function Start() {
  const { setStartPlaying, startPlaying } = useContext(GameContext);

  return (
    !startPlaying && (
      <motion.div
        data-testid="start-container"
        className="h-full flex w-full overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="text-center m-auto rounded-full bg-light text-secondary p-10"
        >
          <h1>Ready to Start Playing</h1>

          <h2>5 Questions Per Round</h2>

          <h2>30 Seconds Per Question</h2>

          <Button play={true} cta={true} onClick={() => setStartPlaying(true)}>
            Start
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, top: "-100%" }}
          animate={
            !startPlaying
              ? { opacity: 1, top: "0%" }
              : { opacity: 0, top: "100%" }
          }
          transition={{ duration: 2.5 }}
          className="w-full h-full absolute -z-10 bg-accent"
        />
      </motion.div>
    )
  );
}
