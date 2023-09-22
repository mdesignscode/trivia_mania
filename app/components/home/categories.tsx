"use client";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Button } from "@/components/styledComponents";
import Loading from "app/loading";
import { Transition } from "@headlessui/react";

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
  const [showMore, setShowMore] = useState(false);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -4 },
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
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-xl">Choose Categories</h1>

        {!fetchingCategories ? (
          <div className="flex flex-col gap-3">
            {/* display categories */}
            <div className="flex flex-col gap-2">
              {/* display first 15 categories */}
              <div className="flex gap-2 flex-wrap justify-center">
                {Object.keys(categoryStats)
                  .slice(0, 15)
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

              {/* user has option to show more */}
              <Transition
                show={showMore}
                as={Fragment}
                enter="transition-transform transition-opacity ease-in-out duration-500"
                enterFrom="translate-y-full opacity-0 scale-50"
                enterTo="translate-y-0 opacity-100 scale-100"
                leave="transition-transform transition-opacity ease-in-out duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="flex gap-2 flex-wrap justify-center">
                  {Object.keys(categoryStats)
                    .slice(15)
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
                              const value =
                                stat === "all categories" ? "" : stat;
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
              </Transition>
            </div>

            {/* categories display controls */}
            <div className="flex justify-center gap-4">
              {/* show more categories */}
              <motion.span
                variants={buttonVariants}
                whileHover="hover"
                whileTap="hover"
                className="w-1/3"
              >
                <Button
                  onClick={() => setShowMore(!showMore)}
                  $primary={true}
                  className="w-full"
                >
                  {!showMore ? "More categories" : "Less categories"}
                </Button>
              </motion.span>

               {/* reset categories */}
              <motion.span
                variants={buttonVariants}
                whileHover="hover"
                whileTap="hover"
                className="w-1/3"
              >
                <Button
                  onClick={() => {
                    setCategories([]);
                    setCategoryChoice((state) => state.map(() => false));
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



