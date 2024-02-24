import { capitalize } from "lodash";
import Image from "next/image";

export default function Board({
  topTenUsers,
}: {
  topTenUsers: TTopTenPlayers;
}) {
  const colorMap: { [key: string]: string } = {
    easy: "green",
    medium: "gold",
    hard: "red",
  };

  return (
    <div className="p-4 overflow-y-auto" data-testid="scoreboard-container">
      <h1 className="text-2xl font-semibold mb-4">Top 10 Scoreboard</h1>
      {topTenUsers.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTenUsers.map(({ user, stats }, index) => (
            <div
              key={user?.id}
              className="dark:bg-accent-200 max-h-72 overflow-y-auto p-4 rounded-lg shadow-xl dark:border-transparent border-2 col gap-3"
              data-testid={`user-${index}-stat`}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={user?.avatar || ""}
                    alt={`Avatar for ${user?.username}`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {index + 1}. {user?.username}
                  </p>
                  <p className="text-gray-500">
                    Total Correct Answers: {user?.correctAnswered}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                {stats.map((categoryStat) => {
                  if (!categoryStat) return;

                  return (
                    <div key={categoryStat.id} className="col">
                      <h3 className="text-gray-700">
                        {categoryStat.category} correct answers
                      </h3>

                      {[
                        "easy" as const,
                        "medium" as const,
                        "hard" as const,
                      ].map((difficulty) => {
                        if (!categoryStat[`${difficulty}Id`]) return;

                        return (
                          <div
                            key={difficulty}
                            className="flex gap-1"
                            style={{
                              color: colorMap[difficulty],
                            }}
                          >
                            <h4>{capitalize(difficulty)}:</h4>
                            <p>{categoryStat[`${difficulty}Correct`]}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
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
