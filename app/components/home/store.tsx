/* Handles all logic for home page */
"use client";
import { QuestionsRecord } from "@/models/storage/fileStorage";
import { GlobalContext } from "app/store";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface IHomeContext {
  difficultyStats: Record<string, number>;
  categoryStats: Record<string, number>;
  difficulty: string;
  fetchingDifficulty: boolean;
  fetchingCategories: boolean;
  getQuestionStats: Function;
  categories: Array<string>;
  setDifficulty: Dispatch<SetStateAction<string>>;
  setCategories: Dispatch<SetStateAction<string[]>>;
}

const defaultHomeContext: IHomeContext = {
  difficultyStats: {},
  categoryStats: {},
  difficulty: "",
  fetchingDifficulty: true,
  fetchingCategories: true,
  getQuestionStats: () => {}, // Provide a default function or implement it later.
  categories: [],
  setDifficulty: () => {}, // Provide a default function or implement it later.
  setCategories: () => {}, // Provide a default function or implement it later.
};

export const HomeContext = createContext<IHomeContext>(defaultHomeContext);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  // home state
  const [stats, setStats] = useState<Record<string, number>>({})
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
  const {
    userStatus: { user },
  } = useContext(GlobalContext);

  // fetch questions based on difficulty
  async function getQuestionStats(difficulty: string) {
    try {
      // load categories
      setFetchingCategories(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl + "questions/stats";

      const { data } = await axios.post(url, { difficulty, userId: user?.id || "" });

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

  async function getInitialQuestionStats() {
    try {
      // load stats
      setFetchingCategories(true);
      setFetchingDifficulty(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl + "questions/stats";

      const { data } = await axios.post(url, { difficulty: "", userId: user?.id || "" });

      setStats(data)

      // display stats
      setFetchingCategories(false);
      setFetchingDifficulty(false);
    } catch (error) {
      console.log(error);
    }
  }

  // set initial questions stats
  useEffect(() => {
    getInitialQuestionStats()
  }, []);

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
  }, [stats]);

  // store object
  const store: IHomeContext = {
    difficultyStats,
    categoryStats,
    difficulty,
    fetchingDifficulty,
    fetchingCategories,
    getQuestionStats,
    categories,
    setDifficulty,
    setCategories,
  };

  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
