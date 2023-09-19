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
  const [showMore, setShowMore] = useState(true);
  const [sliceIndex, setSliceIndex] = useState(15);

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
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      exit={{ x: 100 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-xl">Choose Categories</h1>

        {!fetchingCategories ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.keys(categoryStats)
                .slice(0, sliceIndex)
                .map((stat, i) => {
                  return (
                    <motion.span
                      key={stat}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="hover"
                    >
                      <Button
                        onClick={() => {
                          const value = stat === "all categories" ? "" : stat;
                          handleCategories(i, value);
                        }}
                        $primary={categoryChoice[i]}
                      >
                        {stat} ({categoryStats[stat]})
                      </Button>
                    </motion.span>
                  );
                })}
            </div>

            <div className="flex justify-center gap-4">
              <motion.span
                variants={buttonVariants}
                whileHover="hover"
                whileTap="hover"
                className="w-1/3"
              >
                <Button
                  onClick={() => {
                    setShowMore(!showMore);
                    setSliceIndex(
                      !showMore ? 15 : Object.keys(categoryStats).length
                    );
                  }}
                  $primary={true}
                  className="w-full"
                >
                  {showMore ? "More categories" : "Less categories"}
                </Button>
              </motion.span>

              <motion.span
                variants={buttonVariants}
                whileHover="hover"
                whileTap="hover"
                className="w-1/3"
              >
                <Button
                  onClick={() => {
                    setCategories([])
                    setCategoryChoice(state => state.map(() =>
                    false))
                  }}
                  $primary={true}
                  className="w-full"
                >
                  Reset categories
                </Button>
              </motion.span>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </motion.div>
  );
}

export default Categories;
