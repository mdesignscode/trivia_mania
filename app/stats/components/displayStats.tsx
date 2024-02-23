"use client";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import { motion } from "framer-motion";

interface DisplayStatsProps {
  stats: TUserStats;
  message: string;
}

function isDifficultyStat(stat: string): stat is keyof TDifficultyStat {
  return ["easy", "medium", "hard"].includes(stat);
}

export default function DisplayStats({ stats, message }: DisplayStatsProps) {
  return (
    <motion.div
      initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
    </motion.div>
  );
}
