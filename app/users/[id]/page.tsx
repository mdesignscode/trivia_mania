import storage from "@/models/index";
import DisplayUserProgress from "./components";

export default function UserProgress({
  params: { id },
}: {
  params: { id: string };
}) {
  const userStats = storage.getUserStats(id);
  const user = storage.getUser(id);
  const topTen = storage.getTopTenUsers();

  return (
    <DisplayUserProgress
      {...{
        serializedUser: JSON.stringify(user),
        serializedTopTen: JSON.stringify(topTen),
        userStats,
      }}
    />
  );
}
