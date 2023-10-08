/* Renders categories components */
"use client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import DisplayCategories from "./displayCategories";
import DisplayControls from "./displayControls";

interface RenderCategoriesProps {
  categoryChoice: boolean[];
  handleCategories: (index: number, value: string) => void;
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
}

export default function RenderCategories({
  categoryChoice,
  handleCategories,
  setCategoryChoice,
}: RenderCategoriesProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div
        className="text-center col gap-3"
        data-testid="render-categories-container"
      >
        <h1 className="text-xl">Choose categories</h1>
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
      </div>
    </motion.div>
  );
}
