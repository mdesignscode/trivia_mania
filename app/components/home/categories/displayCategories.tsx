/* Render list of categories */
import { GlobalContext } from "@/app/context/globalContext";
import { Button } from "@/components/styledComponents";
import { HomeContext } from "@/context/homeContext";
import useWindowWidth from "@/hooks/windowWidth";
import { Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import Loading from "../loading";

interface DisplayCategoriesProps {
  showMore: boolean;
  handleCategories: (index: number, value: string) => void;
}

export default function DisplayCategories({
  showMore,
  handleCategories,
}: DisplayCategoriesProps) {
  const { categoryStats, fetchingCategories } = useContext(HomeContext);
  const { categoryChoice } = useContext(GlobalContext);
  const categoriesRadius = Object.keys(categoryStats).length / 2;

  const styles = "flex gap-2 flex-wrap justify-center";

  return fetchingCategories ? (
    <Loading length={15} />
  ) : (
    <div className="col gap-2" data-testid="display-categories-container">
      {/* display first 10 categories */}
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
        <div className={styles} data-testid="second-categories-set">
          {Object.keys(categoryStats)
            .sort()
            .slice(categoriesRadius)
            .map((stat, i) => {
              const j = i + categoriesRadius;
              return (
                <Button
                  onClick={() => {
                    const value = stat === "all categories" ? "" : stat;
                    handleCategories(j, value);
                  }}
                  primary={categoryChoice[j]}
                  key={stat}
                >
                  {stat} ({categoryStats[stat]})
                </Button>
              );
            })}
        </div>
      </Transition>
    </div>
  );
}
