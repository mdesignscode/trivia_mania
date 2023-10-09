/* `Show more categories` and `Reset categories` buttons */
"use client";
import { GlobalContext } from "@/app/store";
import { buttonVariants } from "@/components/store";
import { Button } from "@/components/styledComponents";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useContext } from "react";
import { HomeContext } from "../store";
import Loading from "../loading";

interface DisplayControlsProps {
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showMore: boolean;
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
}

export default function DisplayControls({
  setShowMore,
  showMore,
  setCategoryChoice,
}: DisplayControlsProps) {
  const { setCategories, fetchingCategories } = useContext(HomeContext);
  const { storageIsAvailable } = useContext(GlobalContext);

  function handleReset() {
    setCategories([]);
    setCategoryChoice((state) => state.map(() => false));
    if (storageIsAvailable) localStorage.removeItem("categories");
  }

  return fetchingCategories ? (
    <Loading length={2} width={120} />
  ) : (
    <div
      className="flex justify-center gap-4"
      data-testid="display-controls-container"
    >
      {/* show more categories */}
      <motion.span
        variants={buttonVariants}
        whileHover="hover"
        whileTap="hover"
        className="w-1/3"
      >
        <Button
          onClick={() => setShowMore((state) => !state)}
          $primary={true}
          className="w-full"
          data-testid="show-more-button"
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
          data-testid="reset-categories-button"
          onClick={handleReset}
          $primary={true}
          className="w-full"
        >
          Reset categories
        </Button>
      </motion.span>
    </div>
  );
}
