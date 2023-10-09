"use client";
import User from "@/models/user";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Header({ user }: { user: User }) {
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
          src={user.avatar}
          alt="user avatar icon"
        />

        <h1 className="text-3xl">{user.username}</h1>
      </div>
    </motion.div>
  );
}
