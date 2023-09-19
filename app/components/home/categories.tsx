"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/styledComponents";
import Loading from "app/loading";

interface ICategoriesProps {
  setCategories: Function;
  fetchingCategories: boolean;
  categoryStats: Record<string, number>;
}

function Categories({
  setCategories,
  fetchingCategories,
  categoryStats,
}: ICategoriesProps) {
  const [categoryChoice, setCategoryChoice] = useState<Array<boolean>>([
    false,
    false,
    false,
  ]);

  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -5 },
  };

  function handleCategories(index: number, value: string) {
    setCategoryChoice((state: Array<boolean>) => {
      const newState = [...state];
      newState[index] = !newState[index];
      return newState;
    });

    setCategories((state: Array<string>) => {
      const valueIndex = state.indexOf(value);
      return valueIndex === -1
        ? [...state, value]
        : state.filter((category) => category !== value);
    });
  }

  return (
    <motion.div
    // initial={{ opacity: 0, scale: 0.5 }}
    // animate={{ opacity: 1, scale: 1 }}
    // exit={{ opacity: 0, scale: 0.5 }}
    // transition={{ duration: 0.5 }}
    >
      <div className="text-center flex flex-col gap-3">
        <h1>Choose Categories</h1>

        {!fetchingCategories ? (
          <div className="flex gap-2 flex-wrap justify-center">
            {Object.keys(categoryStats).map((stat, i) => {
              return (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="hover"
                  onClick={() => setIsHovered(!isHovered)}
                >
                  <Button
                    key={stat}
                    onClick={() => {
                      const value = stat === "all categories" ? "" : stat;
                      handleCategories(i, value);
                    }}
                    $primary={categoryChoice[i]}
                  >
                    {stat} ({categoryStats[stat]})
                  </Button>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}

export default Categories;
