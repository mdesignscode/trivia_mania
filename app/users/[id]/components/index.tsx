"use client";
import { progressSelector } from "@/lib/redux/slices/progressSlice";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import HandleUnsavedProgress from "./handleUnsavedProgress";
import DisplayStats from "./displayStats";
import User from "@/models/user";
import { useEffect, useState } from "react";
import { transpileModule } from "typescript";
import Header from "./header";
import Hero from "./hero";

interface DisplayUserProgressProps {
  serializedTopTen: string;
  userStats: Record<string, Record<string, any>>;
  serializedUser: string;
}

export default function DisplayUserProgress({
  serializedUser,
  serializedTopTen,
  userStats,
}: DisplayUserProgressProps) {
  const [progress, setProgress] = useState({});
  const [showProgress, setShowProgress] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const topTen: Array<User> = JSON.parse(serializedTopTen);
  const user: User = JSON.parse(serializedUser);

  let topTenPosition = 0;
  for (let i = 0; i < topTen.length; i++) {
    if (topTen[i].id === user.id) {
      topTenPosition = i + 1;
      break;
    }
  }

  useEffect(() => {
    const progressString = localStorage.getItem("progress") || "{}";
    const parsedProgress = JSON.parse(progressString);

    if (parsedProgress) {
      setProgress(parsedProgress);
      setShowProgress(true);
    }
    setShowStats(true);
  }, []);

  return (
    <div className="text-xl text-gray-800 w-11/12 col gap-4 mx-auto py-4">
      {/* Header */}
      <Header user={user} />

      <HandleUnsavedProgress />

      {Object.keys(userStats).length > 0 ? (
        <>
          {/* Hero */}
          <Hero userStats={userStats} topTenPosition={topTenPosition} />

          {/* user last played results */}
          <DisplayStats message="Your last played results" stats={progress} isShowing={showProgress} />

          {/* user overall stats */}
          <DisplayStats message="Your overall stats" stats={userStats} isShowing={showStats} />
        </>
      ) : (
        <h2>
          You have not answered any questions yet.{" "}
          <Link
            className="text-gray-600 hover:text-gray-800 hover:underline decoration-solid"
            href="/"
          >
            Click here to play
          </Link>
          .
        </h2>
      )}
    </div>
  );
}
