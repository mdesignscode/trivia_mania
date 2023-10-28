/* Render list of categories */
import { GlobalContext } from "@/app/context/globalContext";
import { Button } from "@/components/styledComponents";
import { HomeContext } from "@/context/homeContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import Loading from "../loading";

interface DisplayCategoriesProps {
  showMore: boolean;
  handleCategories: (index: number, value: string) => void;
}

export default function DisplayCategoriesMobile({
  showMore,
  handleCategories,
}: DisplayCategoriesProps) {
  const { categoryStats, fetchingCategories } = useContext(HomeContext);
  const { categoryChoice } = useContext(GlobalContext);
  const categoriesRadius = Math.floor(Object.keys(categoryStats).length / 2);

  const styles = "flex gap-2 flex-wrap justify-center";

  return fetchingCategories ? (
    <Loading length={15} />
  ) : (
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
                  {stat} ({categoryStats[stat]})
                </Button>
              );
            })}
        </div>
      </motion.div>
      )}

      {/* user has option to show more */}
      {showMore && (<motion.div
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
                  onClick={() => {
                    const value = stat === "all categories" ? "" : stat;
                    handleCategories(i, value);
                  }}
                  primary={categoryChoice[i]}
                  key={stat}
                  testid={stat}
                >
                  {stat} ({categoryStats[stat]})
                </Button>
              );
            })}
        </div>
      </motion.div>)}
    </div>
  );
}
