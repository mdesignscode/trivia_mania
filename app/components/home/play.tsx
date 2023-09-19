"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface IPlayProps {
  difficulty: string;
  categories: Array<string>;
}

export default function Play({ difficulty, categories }: IPlayProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -5 },
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 1.5 }}
    >
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="hover"
      onClick={() => setIsHovered(!isHovered)}
    >
      <Link
        className="start-button mt-4"
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
