/* Renders categories components */
"use client";
import { classNames } from "@/components/navigation/desktop";
import { GlobalContext } from "@/context/globalContext";
import { HomeContext } from "@/context/homeContext";
import useWindowWidth from "@/hooks/windowWidth";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import DisplayCategories from "./displayCategories";
import DisplayCategoriesMobile from "./displayCategoriesMobile";
import DisplayControls from "./displayControls";

interface RenderCategoriesProps {
  handleCategories: (index: number, value: string) => void;
}

export default function RenderCategories({
  handleCategories,
}: RenderCategoriesProps) {
  const [showMore, setShowMore] = useState(false);

  const { showCategories } = useContext(HomeContext);
  const isMobile = useWindowWidth();

  const categoriesProps = { showMore, handleCategories };

  const containerStyles = classNames(
    "text-center col gap-3 justify-center mx-4",
    isMobile ? "w-full h-3/4 py-4" : "h-11/12 w-3/4"
  );

  return (
    showCategories && (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className={containerStyles}
        data-testid="render-categories-container"
      >
        <h1 className="text-xl">Choose categories</h1>
        <div className="col gap-3">
          {/* display categories */}
          {isMobile ? (
            <DisplayCategoriesMobile {...categoriesProps} />
          ) : (
            <DisplayCategories {...categoriesProps} />
          )}

          {/* categories display controls */}
          <DisplayControls
            {...{
              showMore,
              setShowMore,
            }}
          />
        </div>
      </motion.div>
    )
  );
}
