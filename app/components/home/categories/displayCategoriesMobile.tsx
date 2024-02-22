/* Render list of categories */
import { GlobalContext } from "@/app/context/globalContext";
import { Button } from "@/components/styledComponents";
import { HomeContext } from "@/context/homeContext";
import { motion } from "framer-motion";
import { useContext } from "react";

interface DisplayCategoriesProps {
  showMore: boolean;
  handleCategories: (index: number, value: string) => void;
}

export default function DisplayCategoriesMobile({
  showMore,
  handleCategories,
}: DisplayCategoriesProps) {
  const { categoryStats, difficultyStats, handleReset } = useContext(HomeContext),
    {
      categoryChoice,
      playFilters: { difficulty },
    } = useContext(GlobalContext),
    categoriesRadius = Math.floor(Object.keys(categoryStats).length / 2),
    totalCategories = Object.keys(categoryStats).length;

  const styles = "flex gap-2 flex-wrap justify-center";

  return (
    <div data-testid="display-categories-mobile-container" className="px-4">
      {!showMore && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className={styles} data-testid="first-categories-set">
            {Object.keys(categoryStats)
              .sort()
              .slice(0, categoriesRadius)
              .map((stat, i) => {
                return (
                  <Button
                    onClick={() => {
                      const value = stat === "all categories" ? "" : stat;
                      handleCategories(i, value);
                    }}
                    primary={categoryChoice[i]}
                    key={stat}
                    testid={stat}
                  >
                    {stat} ({categoryStats[stat][difficulty]})
                  </Button>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* user has option to show more */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className={styles} data-testid="second-categories-set">
            {Object.keys(categoryStats)
              .sort()
              .slice(categoriesRadius)
              .map((stat, i) => {
                return (
                  <Button
                    onClick={() => handleCategories(i, stat)}
                    primary={categoryChoice[i]}
                    key={stat}
                    testid={stat}
                  >
                    {stat} ({categoryStats[stat][difficulty]})
                  </Button>
                );
              })}
            <Button
              onClick={() => {
                handleReset();
                handleCategories(totalCategories, "all difficulties");
              }}
              primary={categoryChoice[totalCategories]}
              key={"all difficulties"}
              testid={"all difficulties"}
            >
              All categories ({difficultyStats["all difficulties"]})
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
