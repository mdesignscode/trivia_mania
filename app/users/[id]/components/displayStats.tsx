"use client";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import { motion } from "framer-motion";

interface DisplayStatsProps {
  stats: IUserStats;
  message: string;
}

export default function DisplayStats({ stats, message }: DisplayStatsProps) {
  const sortedKeys = Object.keys(stats).sort();

  return (
    <motion.div
      initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <h2 className="my-3">{message}</h2>

      <div className="col md:flex-row gap-3">
        {sortedKeys.map((stat) => {
          if (["easy", "hard", "medium"].includes(stat)) {
            const difficultyStat = stats[stat] as DifficultyStat;

            const capitalized = stat.split("");
            capitalized[0] = capitalized[0].toUpperCase();
            const capitalizedDifficulty = capitalized.join("");
            // display cards based on difficulty
            return (
              <div
                className="col md:w-1/3 gap-3 bg-light dark:bg-transparent dark:border-2 dark:border-light p-4 rounded-lg shadow-md"
                key={stat}
              >
                <div className="flex justify-between border-b-2 border-gray-800">
                  <h3 className="text-2xl">{capitalizedDifficulty}</h3>
                  <p>
                    {difficultyStat.correctAnswered}/{difficultyStat.answered}
                  </p>
                </div>

                <div className="col gap-3">
                  {/* display categories by difficulty */}
                  {sortedKeys.map((categoryStat) => {
                    if (
                      !["total", "easy", "hard", "medium"].includes(
                        categoryStat
                      ) &&
                      (stats[categoryStat] as CategoryStat)[stat]
                    ) {
                      const categoryDifficulty = stats[
                        categoryStat
                      ] as CategoryStat;
                      return (
                        <div key={`${stat}_${categoryStat}`}>
                          <h4>{categoryStat}</h4>
                          <div className="ml-3">
                            <p>total: {categoryDifficulty[stat].answered}</p>
                            <p>
                              correct:{" "}
                              {categoryDifficulty[stat].correctAnswered}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          }
        })}
      </div>
    </motion.div>
  );
}
