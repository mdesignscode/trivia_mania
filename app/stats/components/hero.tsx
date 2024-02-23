"use client";
import { motion } from "framer-motion";

export default function Hero({
  userStats,
  topTenPosition,
}: {
  userStats: NonNullable<TUserStats>;
  topTenPosition: number;
}) {
  return (
    <motion.div
      initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
      transition={{ duration: 1.5 }}
    >
      <h2>This is your progress</h2>
      {topTenPosition > 0 && (
        <em>
          Congratulations you are number {topTenPosition} in the Leader board
        </em>
      )}

      <h3>Total questions answered: {userStats.total.answered}</h3>
      <h3>Total correct answers: {userStats.total.correctAnswered}</h3>
    </motion.div>
  );
}
