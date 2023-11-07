import { CategoryStat } from "@/models/interfaces";
import User from "@/models/user";
import _ from "lodash";
import Image from "next/image";

export default function Board({ topTenUsers }: { topTenUsers: Array<User> }) {
  const colorMap: { [key: string]: string } = {
    easy: "green",
    medium: "gold",
    hard: "red",
  };

  return (
    <div className="p-4" data-testid="scoreboard-container">
      <h1 className="text-2xl font-semibold mb-4">Top 10 Scoreboard</h1>
      {topTenUsers.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTenUsers.map((user, index) => (
            <div
              key={user.id}
              className="dark:bg-accent-200 max-h-72 overflow-y-auto p-4 rounded-lg shadow-xl dark:border-transparent border-2 col gap-3"
              data-testid={`user-${index}-stat`}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={user.avatar}
                    alt={`Avatar for ${user.username}`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {index + 1}. {user.username}
                  </p>
                  <p className="text-gray-500">
                    Total Correct Answers: {user.stats.total.correctAnswered}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                {Object.keys(user.stats).map((category) => {
                  if (!["easy", "hard", "medium", "total"].includes(category)) {
                    const categoryStat = user.stats[category] as CategoryStat;
                    return (
                      <div key={_.uniqueId()} data-testid={`${user.username}-${category}`} className="col">
                        <h3 className="text-gray-700">
                          {category} Correct Answers
                        </h3>

                        <div className="flex gap-3">
                          {Object.keys(categoryStat).map((difficulty) => {
                            const capitalized = difficulty.split("");
                            capitalized[0] = capitalized[0].toUpperCase();
                            const capitalizedDifficulty = capitalized.join("");

                            return (
                              <div
                                key={_.uniqueId()}
                                className="flex gap-1"
                                style={{ color: colorMap[difficulty] }}
                              >
                                <h4>{capitalizedDifficulty}:</h4>
                                <p>
                                  {categoryStat[difficulty].correctAnswered}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-2xl">There are currently no top ten players</h1>
      )}
    </div>
  );
}
