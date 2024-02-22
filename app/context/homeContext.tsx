/* Handles all logic for home page */
"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { GlobalContext } from "./globalContext";
import { CATEGORIES } from "@/utils/localStorage_utils";

interface ICurrentUI {
  welcome: boolean;
  difficulties: boolean;
  categories: boolean;
  play: boolean;
}

export interface IHomeContext {
  currentUI: ICurrentUI;
  setCurrentUI: Dispatch<SetStateAction<ICurrentUI>>;
  showCategories: boolean;
  difficultyStats: TQuestionStats;
  categoryStats: Record<string, TQuestionStats>;
  handleReset(): void;
}

export const defaultHomeContext: IHomeContext = {
  difficultyStats: {},
  categoryStats: {},
  currentUI: {
    welcome: true,
    difficulties: false,
    categories: false,
    play: false,
  },
  setCurrentUI: () => {},
  showCategories: false,
  handleReset: () => {},
};

export const HomeContext = createContext<IHomeContext>(defaultHomeContext);

interface IHomeProviderProps {
  children: React.ReactNode;
  difficultyStats: TQuestionStats;
  categoryStats: Record<string, TQuestionStats>;
}

export function HomeProvider({
  children,
  difficultyStats,
  categoryStats,
}: IHomeProviderProps) {
  // home state
  const {
    storageIsAvailable,
    setPlayFilters,
    setNewFilters,
    setCategoryChoice,
  } = useContext(GlobalContext);

  // display different UI's
  const [currentUI, setCurrentUI] = useState<ICurrentUI>({
    welcome: true,
    difficulties: false,
    categories: false,
    play: false,
  });
  const showCategories = currentUI.categories && !currentUI.welcome;

  // set categories choice state
  useEffect(() => {
    setCategoryChoice(
      Object.keys(categoryStats)
        .concat([])
        .map(() => false)
    );
  }, [categoryStats, setCategoryChoice]);

  function handleReset() {
    setNewFilters(true);
    setPlayFilters((state) => ({
      ...state,
      categories: "",
    }));
    setCategoryChoice((state) => state.map(() => false));
    if (storageIsAvailable) localStorage.removeItem(CATEGORIES);
  }

  // store object
  const store: IHomeContext = {
    showCategories,
    setCurrentUI,
    currentUI,
    difficultyStats,
    categoryStats,
    handleReset,
  };

  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
