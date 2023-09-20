import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="mb-4 mt-5">
        <h2 className="text-3xl mb-2 font-bold underline">
          Welcome to Trivia Mania!
        </h2>
        <p>Test your knowledge with exciting trivia questions.</p>
      </div>
    </motion.div>
  );
}
