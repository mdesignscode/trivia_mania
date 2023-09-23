/* Render list of categories */
import { Button } from "@/components/styledComponents";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { Dispatch, SetStateAction, useContext } from "react";
import { HomeContext } from "../store";

interface IDisplayCategories {
  showMore: boolean;
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
  categoryChoice: Array<boolean>;
}

export default function DisplayCategories({
  setCategoryChoice,
  categoryChoice,
  showMore,
}: IDisplayCategories) {
  const { categoryStats, setCategories } = useContext(HomeContext);

  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -4 },
  };

  function handleCategories(index: number, value: string) {
    setCategoryChoice((state) => {
      const newState = [...state];
      newState[index] = !state[index];
      return newState;
    });

    setCategories((state) => {
      const valueIndex = state.indexOf(value);
      return valueIndex === -1
        ? [...state, value]
        : state.filter((category) => category !== value);
    });
  }

  return (
    <div className="col gap-2">
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
              const j = i + 15
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
                      handleCategories(j, value);
                    }}
                    $primary={categoryChoice[j]}
                  >
                    {stat} ({categoryStats[stat]})
                  </Button>
                </motion.span>
              );
            })}
        </div>
      </Transition>
    </div>
  );
}
