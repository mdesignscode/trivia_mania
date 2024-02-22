/* `Show more categories` and `Reset categories` buttons */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { HomeContext } from "@/app/context/homeContext";
import { classNames } from "@/components/navigation/desktop";
import { Button } from "@/components/styledComponents";
import useWindowWidth from "@/hooks/windowWidth";
import { CATEGORIES } from "@/utils/localStorage_utils";
import { Dispatch, SetStateAction, useContext } from "react";

interface DisplayControlsProps {
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showMore: boolean;
}

export default function DisplayControls({
  setShowMore,
  showMore,
}: DisplayControlsProps) {
  const {
    playFilters: { categories },
  } = useContext(GlobalContext);
  const { handleReset } = useContext(HomeContext);
  const isMobile = useWindowWidth();

  return (
    <div
      className="flex justify-center gap-4"
      data-testid="display-controls-container"
    >
      {/* show more categories */}
      <Button
        onClick={() => setShowMore((state) => !state)}
        primary={!showMore}
        testid="show-more-button"
      >
        {!showMore
          ? isMobile
            ? "Next categories"
            : "More categories"
          : isMobile
          ? "Previous categories"
          : "Less categories"}
      </Button>

      {/* reset categories */}
      <Button
        testid="reset-categories-button"
        onClick={handleReset}
        primary={!!categories}
        className={classNames(!categories ? "pointer-events-none" : "")}
      >
        Reset categories
      </Button>
    </div>
  );
}
