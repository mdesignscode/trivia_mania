/* Renders categories components */
"use client";
import Loading from "app/loading";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import DisplayCategories from "./displayCategories";
import DisplayControls from "./displayControls";

interface RenderCategoriesProps {
  fetchingCategories: boolean;
  categoryChoice: boolean[];
  handleCategories: (index: number, value: string) => void;
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
}

export default function RenderCategories({
  fetchingCategories,
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
      <div className="text-center col gap-3">
        <h1 className="text-xl">Choose Categories</h1>

        {!fetchingCategories ? (
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
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}
