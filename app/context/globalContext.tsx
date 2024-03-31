"use client";

import storageAvailable from "@/components/localStorageDetection";
import { IGetUserRequest } from "@/models/customRequests";
import User from "@/models/user";
import {
  CATEGORIES,
  DIFFICULTY,
  PROGRESS,
  USERNAME,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
export interface IUserStatus {
  user: User | null;
  isOnline: boolean;
  isLoaded: boolean;
}

type TFilters = {
  difficulty: string;
  categories: string;
};

export interface IGlobalContext {
  triviaUser: TUser;
  setTriviaUser: Dispatch<SetStateAction<TUser>>;
  storageIsAvailable: boolean;
  setPlayFilters: (
    cb: (state: { difficulty: string; categories: string }) => {
      difficulty: string;
      categories: string;
    }
  ) => void;
  playFilters: TFilters;
  playUrl: string;
  setPageReady: Dispatch<SetStateAction<boolean>>;
  pageReady: boolean;
  difficultyChoice: Record<string, boolean>;
  setDifficultyChoice: Dispatch<SetStateAction<Record<string, boolean>>>;
  categoryChoice: boolean[];
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
  playerMode: "Guest" | "Signed In";
  setPlayerMode: Dispatch<SetStateAction<"Guest" | "Signed In">>;
  newFilters: boolean;
  setNewFilters: Dispatch<SetStateAction<boolean>>;
}

export const initialGlobalContext: IGlobalContext = {
  triviaUser: null,
  setTriviaUser: () => {},
  storageIsAvailable: false,
  playFilters: {
    difficulty: "",
    categories: "",
  },
  setPlayFilters: () => {},
  playUrl: "/game?difficulty=&categories=",
  pageReady: false,
  setPageReady: () => {},
  difficultyChoice: {},
  setDifficultyChoice: () => {},
  categoryChoice: [],
  setCategoryChoice: () => {},
  playerMode: "Guest",
  setPlayerMode: () => {},
  setNewFilters: () => {},
  newFilters: false,
};

export const GlobalContext =
  createContext<IGlobalContext>(initialGlobalContext);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  // global state
  // app uses localStorage
  const [storageIsAvailable, setStorageIsAvailable] = useState(false);
  const [triviaUser, setTriviaUser] = useState<TUser>(null);

  const [difficultyChoice, setDifficultyChoice] = useState<
    Record<string, boolean>
  >({
    easy: false,
    medium: false,
    hard: false,
    "all difficulties": false,
  });
  const [categoryChoice, setCategoryChoice] = useState<boolean[]>([]);

  // play navigation link will have current play filters
  const [playFilters, setPlayFilters] = useState({
    difficulty: "",
    categories: "",
  });
  const playUrl = encodeURI(
    `/game?difficulty=${
      playFilters.difficulty
    }&categories=${playFilters.categories.replaceAll("&", "|")}`
  );

  const [newFilters, setNewFilters] = useState(false);

  const [pageReady, setPageReady] = useState(false);

  const [playerMode, setPlayerMode] = useState<"Guest" | "Signed In">("Guest");

  const path = usePathname();

  useEffect(() => {
    // detect storage feature
    setStorageIsAvailable(storageAvailable());
  }, []);

  useEffect(() => {
    if (/sso-callback/.test(path)) {
      setPageReady(true);
    }
  }, [path]);

  // set online user
  useEffect(() => {
    if (triviaUser) {
      // set online user

      if (storageIsAvailable) {
        // check if current user is previous user
        const prevUserName = localStorage.getItem(USERNAME);

        if (prevUserName) {
          if (prevUserName !== triviaUser.username) {
            // if not previous user, clear localStorage
            clearQuestionData();
            localStorage.setItem(USERNAME, triviaUser.username);
            localStorage.removeItem(PROGRESS);
            localStorage.removeItem(DIFFICULTY);
            localStorage.removeItem(CATEGORIES);
          }
        } else {
          localStorage.setItem(USERNAME, triviaUser.username);
        }
      }
    }
  }, [storageIsAvailable, triviaUser]);

  // get last set filters from local storage and put it in state
  useEffect(() => {
    if (storageIsAvailable) {
      const previousDifficulty = localStorage.getItem(DIFFICULTY);
      const previousCategories = localStorage.getItem(CATEGORIES);

      if (previousDifficulty) {
        setPlayFilters((state) => ({
          ...state,
          difficulty: previousDifficulty,
        }));

        setDifficultyChoice((state) => ({
          ...state,
          [previousDifficulty]: true,
        }));
      }

      if (previousCategories) {
        setPlayFilters((state) => ({
          ...state,
          categories: previousCategories,
        }));
      }
    }
  }, [storageIsAvailable]);

  // store object
  const store: IGlobalContext = {
    triviaUser,
    setTriviaUser,
    storageIsAvailable: storageIsAvailable,
    playFilters,
    setPlayFilters: setPlayFilters,
    playUrl,
    pageReady,
    setPageReady,
    setDifficultyChoice,
    difficultyChoice,
    setCategoryChoice,
    categoryChoice,
    playerMode,
    setPlayerMode,
    newFilters,
    setNewFilters,
  };

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  );
}
