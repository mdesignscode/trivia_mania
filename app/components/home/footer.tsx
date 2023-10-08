import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <footer
        data-testid="footer-container"
        className="footer w-full py-4 flex justify-center mt-5"
      >
        <p>&copy; 2023 Trivia Mania. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}
