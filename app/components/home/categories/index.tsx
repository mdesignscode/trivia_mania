/* Renders categories components */
"use client";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Loading from "app/loading";
import { HomeContext } from "../store";
import DisplayCategories from "./displayCategories";
import DisplayControls from "./displayControls";

function Categories() {
  const { categoryStats, fetchingCategories } = useContext(HomeContext);
  const [showMore, setShowMore] = useState(false);
  const [categoryChoice, setCategoryChoice] = useState<Array<boolean>>(
    Object.keys(categoryStats).map(() => false)
  );
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
                setCategoryChoice,
                categoryChoice,
                showMore,
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

export default Categories;
