"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useContext } from "react";
import { HomeContext } from "./store";

export default function Play() {
  const { difficulty, categories } = useContext(HomeContext)
  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -5 },
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="hover"
      >
        <Link
          className="start-button"
          href={encodeURI(
            `/game?difficulty=${difficulty}&categories=${categories.join(",")}`
          )}
        >
          Start Playing
        </Link>
      </motion.button>
    </motion.div>
  );
}
