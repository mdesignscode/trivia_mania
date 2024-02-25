"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import DisplayStats from "./displayStats";
import Header from "./header";
import Hero from "./hero";

interface DisplayUserProgressProps {
  topTenPosition: number;
  userStats: TCategoryStat[] | null;
}

export default function DisplayUserProgress({
  topTenPosition,
  userStats
}: DisplayUserProgressProps) {
  return (
    <div
      className="text-xl text-gray-800 w-11/12 col gap-4 mx-auto py-4 overflow-y-auto"
      data-testid="display-user-progress-container"
    >
      {/* Header */}
      <Header />

      {userStats ? (
        <>
          {/* Hero */}
          <Hero topTenPosition={topTenPosition} />

          {/* user overall stats */}
          <DisplayStats message="Your overall stats" userStats={userStats} />
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
