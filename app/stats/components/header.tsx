"use client";

import { GlobalContext } from "@/app/context/globalContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useContext } from "react";

export default function Header() {
  const { triviaUser } = useContext(GlobalContext);
  return (
    <motion.div
      initial={{ perspective: 400, rotate: 20, y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, perspective: 400, rotate: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div
        className="flex items-center gap-5"
        data-testid="user-header-container"
      >
        <Image
          className="rounded-full"
          width={50}
          height={50}
          src={triviaUser?.avatar || ""}
          alt="user avatar icon"
        />

        <h1 className="text-3xl">{triviaUser?.username}</h1>
      </div>
    </motion.div>
  );
}
