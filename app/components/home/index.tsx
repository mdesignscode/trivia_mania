"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import AddUserToStorage from "./addUserToStorage";
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

  AddUserToStorage();

  async function getQuestionStats(difficulty: string) {
    // load categories
    setFetchingCategories(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = baseUrl + "questions/stats";

    const { data } = await axios.post(url, { difficulty });
    setCategoryStats(data);

    // display categories
    setFetchingCategories(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, }}
      transition={{ duration: 0.5 }}
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
  );
}

export default HomePage;
