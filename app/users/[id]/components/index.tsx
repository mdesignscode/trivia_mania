"use client";
import { GlobalContext } from "@/app/context/globalContext";
import HandleUnsavedProgress from "@/components/handleUnsavedProgress";
import { IUserStats } from "@/models/interfaces";
import User from "@/models/user";
import { PROGRESS } from "@/utils/localStorage_utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import DisplayStats from "./displayStats";
import Header from "./header";
import Hero from "./hero";

interface DisplayUserProgressProps {
  serializedTopTen: string;
  userStats: IUserStats;
  serializedUser: string;
}

export default function DisplayUserProgress({
  serializedUser,
  serializedTopTen,
  userStats,
}: DisplayUserProgressProps) {
  const [progress, setProgress] = useState<IUserStats>({
    total: { answered: 0, correctAnswered: 0 },
  });
  const topTen: Array<User> = JSON.parse(serializedTopTen);
  const user: User = JSON.parse(serializedUser);
  const { storageIsAvailable } = useContext(GlobalContext);

  let topTenPosition = 0;
  for (let i = 0; i < topTen.length; i++) {
    if (topTen[i].id === user.id) {
      topTenPosition = i + 1;
      break;
    }
  }

  useEffect(() => {
    if (storageIsAvailable) {
      const progressString = localStorage.getItem(PROGRESS);

      if (progressString) {
        const parsedProgress = JSON.parse(progressString);
        setProgress(parsedProgress);
      }
    }
  }, [storageIsAvailable]);

  return (
    <div
      className="text-xl text-gray-800 w-11/12 col gap-4 mx-auto py-4"
      data-testid="display-user-progress-container"
    >
      {/* Header */}
      <Header user={user} />
      <motion.div
        initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
        exit={{ y: 0, opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <HandleUnsavedProgress />
      </motion.div>

      {Object.keys(userStats).length > 1 ? (
        <>
          {/* Hero */}
          <Hero userStats={userStats} topTenPosition={topTenPosition} />

          {/* user last played results */}
          {Object.keys(progress).length > 1 && (
            <DisplayStats message="Your last played results" stats={progress} />
          )}

          {/* user overall stats */}
          <DisplayStats message="Your overall stats" stats={userStats} />
        </>
      ) : (
        <motion.div
          initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
          exit={{ y: 0, opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h2 data-testid="no-stats-available">
            You have not answered any questions yet.{" "}
            <Link
              className="text-gray-600 hover:text-gray-800 hover:underline decoration-solid"
              href="/"
            >
              Click here to play
            </Link>
            .
          </h2>
        </motion.div>
      )}
    </div>
  );
}
