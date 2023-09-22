"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Difficulties from "./difficulties";
import Categories from "./categories";
import Header from "./header";
import Play from "./play";
import Footer from "./footer";

function HomePage({ stats }: Record<string, any>) {
  const [difficultyStats, setDifficultyStats] = useState<
    Record<string, number>
  >({});
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState<Array<string>>([]);
  const [fetchingDifficulty, setFetchingDifficulty] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  async function getQuestionStats(difficulty: string) {
    try {
      // load categories
      setFetchingCategories(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl + "questions/stats";

      const { data } = await axios.post(url, { difficulty });

      let difficultyCategories: Record<string, number> = {};
      if (!difficulty) {
        for (const key in data) {
          if (!["easy", "hard", "medium", "all difficulties"].includes(key)) {
            difficultyCategories[key] = data[key];
          }
        }
      } else difficultyCategories = data;
      setCategoryStats(difficultyCategories);

      // display categories
      setFetchingCategories(false);
    } catch (error) {
      console.log(error);
    }
  }

  // set initial questions stats
  useEffect(() => {
    for (const key in stats) {
      // set difficulty stats
      if (["easy", "medium", "hard", "all difficulties"].includes(key)) {
        setDifficultyStats((state) => ({
          ...state,
          [key]: stats[key],
        }));
      } else {
        // set categories stats
        setCategoryStats((state) => ({
          ...state,
          [key]: stats[key],
        }));
      }
    }

    // display data
    setFetchingDifficulty(false);
    setFetchingCategories(false);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        id="home-container"
      >
        <div className="homepage flex flex-col">
          <main className="main-content flex-col items-center flex">
            <Header />

            <div className="text-center flex flex-col gap-4 w-4/5">
              <Difficulties
                {...{
                  setDifficulty,
                  getQuestionStats,
                  fetchingDifficulty,
                  difficultyStats,
                  difficulty,
                }}
              />

              <Categories
                {...{
                  setCategories,
                  fetchingCategories,
                  categoryStats,
                }}
              />
            </div>

            <Play {...{ difficulty, categories }} />
          </main>

          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HomePage;
