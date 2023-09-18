import storage from "@/models/index";
import Image from "next/image";

export default function UserProgress({
  params: { id },
}: {
  params: { id: string };
}) {
  const userStats = storage.getUserStats(id);
  const user = storage.getUser(id);
  const topTen = storage.getTopTenUsers();
  let topTenPosition = 0;
  for (let i = 0; i < topTen.length; i++) {
    if (topTen[i].id === id) {
      topTenPosition = i + 1;
      break;
    }
  }

  const sortedKeys = Object.keys(userStats).sort();

  return (
    <div className="text-xl text-gray-800 w-11/12 flex flex-col gap-4 mx-auto py-4">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Image
          className="rounded-full"
          width={50}
          height={50}
          src={user.avatar}
          alt="user avatar icon"
        />

        <h1 className="text-3xl">{user.username}</h1>
      </div>

      {/* Hero */}
      <div>
        <h2>This is your progress</h2>
        {topTenPosition > 0 && (
          <h2>
            Congratulations you are number {topTenPosition} in the Leader board
          </h2>
        )}

        <h3>Total questions answered: {userStats.total.answered}</h3>
        <h3>Total correct answers: {userStats.total.correctAnswered}</h3>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-3">
        {sortedKeys.map((stat) => {
          if (["easy", "hard", "medium"].includes(stat)) {
            const capitalized = stat.split("");
            capitalized[0] = capitalized[0].toUpperCase();
            const capitalizedDifficulty = capitalized.join("");
            // display cards based on difficulty
            return (
              <div
                className="flex flex-col md:w-1/3 gap-3 bg-white p-4 rounded-lg shadow-md"
                key={stat}
              >
                <div className="flex justify-between border-b-2 border-gray-800">
                  <h3 className="text-2xl">{capitalizedDifficulty}</h3>
                  <p>
                    {userStats[stat].correctAnswered}/{userStats[stat].answered}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* display categories by difficulty */}
                  {sortedKeys.map((categoryStat) => {
                    if (
                      !["total", "easy", "hard", "medium"].includes(
                        categoryStat
                      ) &&
                      userStats[categoryStat][stat]
                    ) {
                      return (
                        <div key={`${stat}_${categoryStat}`}>
                          <h4>{categoryStat}</h4>
                          <div className="ml-3">
                            <p>
                              total: {userStats[categoryStat][stat].answered}
                            </p>
                            <p>
                              correct:{" "}
                              {userStats[categoryStat][stat].correctAnswered}
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
    </div>
  );
}
