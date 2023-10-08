"use client";
import { GlobalContext } from "@/app/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext } from "react";
import { buttonVariants } from "../store";
import { Button } from "../styledComponents";
import { HomeContext } from "./store";

export default function Play() {
  const { difficulty, categories } = useContext(HomeContext);
  const { storageIsAvailable } = useContext(GlobalContext);
  function handlePlay() {
    if (storageIsAvailable) {
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("categories", categories.join(","));
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
          data-testid="play-link"
        >
          <Button $cta={true} onClick={handlePlay} data-testid="play-button">
            Start Playing
          </Button>
        </Link>
      </motion.span>
    </motion.div>
  );
}
