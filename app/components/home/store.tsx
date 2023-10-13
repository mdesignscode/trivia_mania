/* Handles all logic for home page */
"use client";
import { GlobalContext } from "@/app/store";
import useInitialStats from "@/hooks/inititialStats";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IHomeContext {
  categoryStats: Record<string, number>;
  difficulty: string;
  fetchingCategories: boolean;
  getQuestionStats: Function;
  categories: Array<string>;
  setDifficulty: Dispatch<SetStateAction<string>>;
  setCategories: Dispatch<SetStateAction<string[]>>;
  setFetchingCategories: Dispatch<SetStateAction<boolean>>;
}

export const defaultHomeContext: IHomeContext = {
  categoryStats: {},
  difficulty: "",
  fetchingCategories: true,
  getQuestionStats: () => {},
  categories: [],
  setDifficulty: () => {},
  setCategories: () => {},
  setFetchingCategories: () => {},
};

export const HomeContext = createContext<IHomeContext>(defaultHomeContext);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  // home state
  const { categoryStats: initialCategoryStats, categoriesLoading } =
    useInitialStats();

  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState<Array<string>>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const {
    userStatus: { user },
  } = useContext(GlobalContext);

  useEffect(() => {
    setFetchingCategories(categoriesLoading);
    setCategoryStats(initialCategoryStats);
  }, [categoriesLoading, initialCategoryStats]);

  // fetch questions based on difficulty
  async function getQuestionStats(difficulty: string) {
    try {
      // load categories
      setFetchingCategories(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl + "questions/stats";

      const { data } = await axios.post(url, {
        difficulty,
        userId: user?.id || "",
      });

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

  // store object
  const store: IHomeContext = {
    categoryStats,
    difficulty,
    fetchingCategories,
    getQuestionStats,
    categories,
    setDifficulty,
    setCategories,
    setFetchingCategories,
  };

  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
