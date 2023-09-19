import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div>
      <div className="mb-4 mt-5">
        <h2 className="text-3xl mb-2 font-bold underline">
          Welcome to Trivia Mania!
        </h2>
        <p>Test your knowledge with exciting trivia questions.</p>
      </div>
    </motion.div>
  );
}
