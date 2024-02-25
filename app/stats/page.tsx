import DisplayUserProgress from "./components";
import { currentUser } from "@clerk/nextjs";

export default async function UserProgress() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = await currentUser(),
    topTenPosition = await setPosition(),
    userStats = await setStats();

    async function setPosition() {
      const url = baseUrl + "users/topTenPosition",
        request = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }),
        response = await request.json();
      return response.topTenPosition;
    }

    async function setStats() {
      const url = baseUrl + "users/stats",
        request = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }),
        response = await request.json();
      return response
    }

  return (
    <DisplayUserProgress
      userStats={userStats}
      topTenPosition={topTenPosition}
    />
  );
}
