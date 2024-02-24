"use client";

import { useUser } from "@clerk/nextjs";
import DisplayUserProgress from "./components";
import { useEffect, useState } from "react";

export default function UserProgress() {
  const { user } = useUser(),
    [topTenPosition, setTopTenPosition] = useState(0),
    [userStats, setUserStats] = useState<TCategoryStat[] | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      setTopTenPosition(response.topTenPosition);
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
      setUserStats(response);
    }

    setPosition();
    setStats();
  }, [user?.id]);

  return (
    <DisplayUserProgress
      userStats={userStats}
      topTenPosition={topTenPosition}
    />
  );
}
