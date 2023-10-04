import storage from "@/models/index";
import DisplayUserProgress from "./components";
import { initialStat } from "@/models/interfaces";
import NotFound from "./components/404";

export default function UserProgress({
  params: { id },
}: {
  params: { id: string };
}) {
  const userStats = storage.getUserStats(id) || initialStat;
  const user = storage.getUser(id);
  const topTen = storage.getTopTenUsers();

  return user ? (
    <DisplayUserProgress
      {...{
        serializedUser: JSON.stringify(user),
        serializedTopTen: JSON.stringify(topTen),
        userStats,
      }}
    />
  ) : (
    <NotFound id={id} />
  );
}
