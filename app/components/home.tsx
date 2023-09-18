"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./styledComponents";
import axios from "axios";
import Loading from "app/loading";
import AddUserToStorage from "./addUserToStorage";

function HomePage({ stats }: Record<string, any>) {
  const [difficultyStats, setDifficultyStats] = useState<
    Record<string, number>
  >({});
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );
  const [difficultyChoice, setDifficultyChoice] = useState<Array<boolean>>([
    false,
    false,
    false,
  ]);
  const [categoryChoice, setCategoryChoice] = useState<Array<boolean>>([
    false,
    false,
    false,
  ]);
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState<Array<string>>([]);
  const [fetchingDifficulty, setFetchingDifficulty] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  AddUserToStorage()

  async function getQuestionStats(difficulty: string) {
    // load categories
    setFetchingCategories(true)

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = baseUrl + "questions/stats";

    const { data } = await axios.post(url, { difficulty });
    setCategoryStats(data);

    // display categories
    setFetchingCategories(false)
  }

  function handleDifficulty(index: number, value: string) {

    setDifficultyChoice((state: Array<boolean>) =>
      state.map((_, i) => {
        return i === index ? true : false;
      })
    );
    setDifficulty(value);

    getQuestionStats(value);
  }

  function handleCategories(index: number, value: string) {
    setCategoryChoice((state: Array<boolean>) => {
      const newState = [...state];
      newState[index] = !newState[index];
      return newState;
    });

    setCategories((state: Array<string>) => {
      const valueIndex = state.indexOf(value);
      return valueIndex === -1
        ? [...state, value]
        : state.filter((category) => category !== value);
    });
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
    >
    <div className="homepage flex flex-col">
      <main className="main-content flex-col items-center flex">
        <div className="mb-4 mt-5">
          <h2 className="text-3xl mb-2 font-bold underline">
            Welcome to Trivia Mania!
          </h2>
          <p>Test your knowledge with exciting trivia questions.</p>
        </div>

        <div className="text-center flex flex-col gap-4 w-4/5">
          <div className="text-center flex flex-col gap-3">
            <h1>Choose difficulty</h1>

            {!fetchingDifficulty ? (
              <div className="flex gap-2 flex-wrap justify-center">
                {Object.keys(difficultyStats).map((stat, i) => {
                  return (
                    <Button
                      key={stat}
                      onClick={() => {
                        const value = stat === "all difficulties" ? "" : stat;
                        handleDifficulty(i, value);
                      }}
                      $primary={difficultyChoice[i]}
                    >
                      {stat} ({difficultyStats[stat]})
                    </Button>
                  );
                })}
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <div className="text-center flex flex-col gap-3">
            <h1>Choose Categories</h1>

            {!fetchingCategories ? (
              <div className="flex gap-2 flex-wrap justify-center">
                {Object.keys(categoryStats).map((stat, i) => {
                  return (
                    <Button
                      key={stat}
                      onClick={() => {
                        const value = stat === "all categories" ? "" : stat;
                        handleCategories(i, value);
                      }}
                      $primary={categoryChoice[i]}
                    >
                      {stat} ({categoryStats[stat]})
                    </Button>
                  );
                })}
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>

        <Link
          className="start-button mt-4"
          href={encodeURI(
            `/game?difficulty=${difficulty}&categories=${categories.join(",")}`
          )}
        >
          Start Playing
        </Link>
      </main>

      <footer className="footer w-full py-4 flex justify-center mt-5">
        <p>&copy; 2023 Trivia Mania. All rights reserved.</p>
      </footer>
    </div>
    </motion.div>
  );
}

export default HomePage;
