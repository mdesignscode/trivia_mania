/* Responsible for rendering home components */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Difficulties from "./difficulties";
import Categories from "./categories";
import Header from "./header";
import Play from "./play";
import Footer from "./footer";

function HomePage() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="homepage col">
          <main className="main-content flex-col items-center flex">
            <Header />

            <div className="text-center col gap-4 w-4/5">
              <Difficulties />

              <Categories />
            </div>

            <Play />
          </main>

          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HomePage;
