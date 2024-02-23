"use client";

import { useUser } from "@clerk/nextjs";
import DisplayUserProgress from "./components";
import { useEffect, useState } from "react";

export default function UserProgress() {
  const { user } = useUser(),
    [topTenPosition, setTopTenPosition] = useState(0)

  useEffect(() => {
    async function setPosition () {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
        url = baseUrl + "users/topTenPosition",
        request = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user?.id }),
        }),
        response = await request.json();
        setTopTenPosition(response.topTenPosition);
    }
    setPosition()
  }, [user?.id])

  return <DisplayUserProgress topTenPosition={topTenPosition} />;
}
