import { colorMap } from "@/app/game/components/question";
import { motion } from "framer-motion";
import { capitalize } from "lodash";

interface DisplayStatsProps {
  stats: NonNullable<TUserStats>;
  message: string;
}

function isDifficultyStat(stat: string): stat is keyof TDifficultyStat {
  return ["easy", "medium", "hard"].includes(stat);
}

export default function DisplayStats({ stats, message }: DisplayStatsProps) {
  return (
    <motion.div
      initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="space-y-4 w-full"
    >
      <strong>{message}</strong>

      <div className="col gap-3 md:flex-row">
        {["easy", "medium", "hard"].map((difficulty) => {
          const sortedCategories = stats.categoryStats.toSorted((a, b) =>
              (a?.category || "") > (b?.category || "") ? 1 : 0
            ),
            categoriesByDifficulty = sortedCategories.filter(
              (categoryStat) =>
                (categoryStat?.difficultyStats.filter(
                  (difficultyStat) => difficultyStat?.difficulty === difficulty
                ) || [])[0]?.difficulty === difficulty
            );

          return (
            categoriesByDifficulty.length > 0 && (
              <div
                key={difficulty}
                className="border-2 dark:border-light rounded-lg space-y-3 p-4 md:flex-1"
              >
                <strong style={{ color: colorMap[difficulty] }}>
                  {capitalize(difficulty)}
                </strong>

                <div className="col">
                  {categoriesByDifficulty.map((categoryStat) => (
                    <div
                      key={categoryStat?.id}
                      className="flex justify-between"
                    >
                      <p>{categoryStat?.category}</p>

                      <div>
                        {categoryStat?.difficultyStats[0]?.correctAnswered}/
                        {categoryStat?.difficultyStats[0]?.correctAnswered}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })}
      </div>
    </motion.div>
  );
}
