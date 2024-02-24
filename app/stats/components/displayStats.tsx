import { colorMap } from "@/app/game/components/question";
import { motion } from "framer-motion";
import { capitalize } from "lodash";

interface DisplayStatsProps {
  userStats: TCategoryStat[];
  message: string;
}

export default function DisplayStats({
  userStats,
  message,
}: DisplayStatsProps) {
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
        {["easy" as const, "medium" as const, "hard" as const].map(
          (difficulty) => {
            const filteredStats = userStats.filter(
              (stat) => !!stat && !!stat[`${difficulty}Id`]
            );

            return (
              !!filteredStats.length && (
                <div
                  key={difficulty}
                  className="col gap-3 border-2 rounded-lg p-4 md:flex-1"
                  style={{ borderColor: colorMap[difficulty] }}
                >
                  <strong style={{ color: colorMap[difficulty] }}>
                    {capitalize(difficulty)}
                  </strong>

                  {userStats
                    .filter((stat): stat is NonNullable<typeof stat> => !!stat)
                    .map((stat) => {
                      if (stat[`${difficulty}Id`]) {
                        return (
                          <div
                            key={stat[`${difficulty}Id`]}
                            className="col gap-1"
                          >
                            <p>{stat.category}</p>

                            <div className="w-[95%] text-base ml-auto">
                              <div className="flex justify-between">
                                <p>Total answered</p>
                                <p>{stat[`${difficulty}Answered`]}</p>
                              </div>
                              <div className="flex justify-between">
                                <p>Correct answered</p>
                                <p>{stat[`${difficulty}Correct`]}</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              )
            );
          }
        )}
      </div>
    </motion.div>
  );
}
