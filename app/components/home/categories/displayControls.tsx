/* `Show more categories` and `Reset categories` buttons */
"use client";
import { Button } from "@/components/styledComponents";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useContext } from "react";
import { HomeContext } from "../store";

interface IDisplayControls {
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showMore: boolean;
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
}

export default function DisplayControls({
  setShowMore,
  showMore,
  setCategoryChoice,
}: IDisplayControls) {
  const { setCategories } = useContext(HomeContext);
  const buttonVariants = {
    rest: { translateY: 1 },
    hover: { translateY: -4 },
  };

  return (
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
  );
}