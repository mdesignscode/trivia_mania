/* Handles all logic for home page */
"use client";
import { GlobalContext } from "@/context/globalContext";
import useInitialStats from "@/hooks/initialStats";
import { TStatsRequest } from "@/models/customRequests";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ICurrentUI {
  welcome: boolean;
  difficulties: boolean;
  categories: boolean;
  play: boolean;
}

export interface IHomeContext {
  categoryStats: Record<string, number>;
  fetchingCategories: boolean;
  getDifficultyCategoriesStats: (difficulty: string) => Promise<void>;
  setFetchingCategories: Dispatch<SetStateAction<boolean>>;
  currentUI: ICurrentUI;
  setCurrentUI: Dispatch<SetStateAction<ICurrentUI>>;
  showCategories: boolean
}

export const defaultHomeContext: IHomeContext = {
  categoryStats: {},
  fetchingCategories: true,
  getDifficultyCategoriesStats: () => Promise.resolve(),
  setFetchingCategories: () => {},
  currentUI: {
    welcome: true,
    difficulties: false,
    categories: false,
    play: false,
  },
  setCurrentUI: () => {},
  showCategories: false
};

export const HomeContext = createContext<IHomeContext>(defaultHomeContext);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  // home state
  const { categoryStats: initialCategoryStats, categoriesLoading } =
    useInitialStats();

  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );

  // display different UI's
  const [currentUI, setCurrentUI] = useState<ICurrentUI>({
    welcome: true,
    difficulties: false,
    categories: false,
    play: false,
  });
  const showCategories = currentUI.categories && !currentUI.welcome;

  const [fetchingCategories, setFetchingCategories] = useState(true);
  const {
    userStatus: { user },
  } = useContext(GlobalContext);

  useEffect(() => {
    setFetchingCategories(categoriesLoading);
    setCategoryStats(initialCategoryStats);
  }, [categoriesLoading, initialCategoryStats]);

  // fetch category stats based on difficulty
  async function getDifficultyCategoriesStats(difficulty: string) {
    try {
      // load categories
      setFetchingCategories(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl + "questions/stats";

      const { data } = await axios.post(url, {
        recordType: "categories",
        difficulty,
        userId: user?.id,
      } as TStatsRequest);
      setCategoryStats(data);

      // display categories
      setFetchingCategories(false);
    } catch (error) {
      console.log(error);
    }
  }

  // store object
  const store: IHomeContext = {
    showCategories,
    categoryStats,
    fetchingCategories,
    getDifficultyCategoriesStats,
    setFetchingCategories,
    setCurrentUI,
    currentUI,
  };

  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
