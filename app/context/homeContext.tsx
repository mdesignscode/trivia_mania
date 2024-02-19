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
  const { setCategoryChoice } = useContext(GlobalContext);

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

  // store object
  const store: IHomeContext = {
    showCategories,
    setCurrentUI,
    currentUI,
    difficultyStats,
    categoryStats,
  };

  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
