/* `Show more categories` and `Reset categories` buttons */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { Button } from "@/components/styledComponents";
import { HomeContext } from "@/context/homeContext";
import { CATEGORIES } from "@/utils/localStorage_utils";
import { Dispatch, SetStateAction, useContext } from "react";
import Loading from "../loading";
import useWindowWidth from "@/hooks/windowWidth";

interface DisplayControlsProps {
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showMore: boolean;
}

export default function DisplayControls({
  setShowMore,
  showMore,
}: DisplayControlsProps) {
  const { fetchingCategories } = useContext(HomeContext);
  const {
    storageIsAvailable,
    setPlayFilters,
    setCategoryChoice,
    playFilters: { categories },
  } = useContext(GlobalContext);
  const isMobile = useWindowWidth();

  function handleReset() {
    setPlayFilters((state) => ({
      ...state,
      categories: "",
    }));
    setCategoryChoice((state) => state.map(() => false));
    if (storageIsAvailable) localStorage.removeItem(CATEGORIES);
  }

  return fetchingCategories ? (
    <Loading length={2} width={120} />
  ) : (
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
      >
        Reset categories
      </Button>
    </div>
  );
}
