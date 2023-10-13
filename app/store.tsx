"use client";

import User from "@/models/user";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import storageAvailable from "./components/localStorageDetection";

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
  userStatus: IUserStatus;
  setUserStatus: (state: IUserStatus) => void;
  storageIsAvailable: boolean;
  setPlayFilters: Dispatch<SetStateAction<TFilters>>;
  playFilters: TFilters;
}

export const initialGlobalContext: IGlobalContext = {
  userStatus: {
    user: null as User | null,
    isOnline: false,
    isLoaded: false,
  },
  storageIsAvailable: false,
  setUserStatus: () => {},
  playFilters: {
    difficulty: "",
    categories: ""
  },
  setPlayFilters: () => {}
};
export const GlobalContext =
  createContext<IGlobalContext>(initialGlobalContext);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  // global state
  // app uses localStorage
  const [storageIsAvailable, setStorageIsAvailable] = useState(false);
  const [userStatus, setUserStatus] = useState({
    user: null as User | null,
    isOnline: false,
    isLoaded: false,
  });

  // play navigation link will have current play filters
  const [playFilters, setPlayFilters] = useState({
    difficulty: "",
    categories: "",
  });

  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // detect storage feature
    setStorageIsAvailable(storageAvailable());
  }, []);

  // fetch user from backend
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [userId, setUserId] = useState("");

  const { data, isFetched } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = baseUrl + "users/getUser";

        const { data } = await axios.post(url, { id: userId });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: {},
    enabled: shouldFetchUser,
  });

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && storageIsAvailable) {
        // fetch user
        setUserId(user.id);
        setShouldFetchUser(true);

        if (isFetched) {
          // set online user
          const triviaUser = data;
          setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });

          // check if current user is previous user
          const prevUserName = localStorage.getItem("username");

          if (prevUserName) {
            if (prevUserName !== triviaUser.username) {
              // if not previous user, clear localStorage
              localStorage.setItem("username", triviaUser.username);
              localStorage.removeItem("progress");
              localStorage.removeItem("difficulties");
              localStorage.removeItem("categories");
              localStorage.removeItem("unsavedData");
              localStorage.removeItem("hasUnsavedData");
              localStorage.removeItem("questionsList");
              localStorage.removeItem("questionsPool");
              localStorage.removeItem("poolIndex");
              localStorage.removeItem("currentIndex");
              localStorage.removeItem("answeredQuestions");
            }
          } else {
            localStorage.setItem("username", triviaUser.username);
          }
        }
      } else if (!storageIsAvailable && isSignedIn) {
        // fetch user
        setUserId(user.id);
        setShouldFetchUser(true);

        if (isFetched) {
          // set online user
          const triviaUser = data;
          setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });
        }
      } else {
        setUserStatus({ user: null, isLoaded: true, isOnline: false });
      }
    }
  }, [isLoaded, isSignedIn, storageIsAvailable, isFetched]);

  // get last set filters from local storage and put it in state
  useEffect(() => {
    if (storageIsAvailable) {
      const previousDifficulty = localStorage.getItem("difficulty")
      const previousCategories = localStorage.getItem("categories")

      if (previousDifficulty) {
        setPlayFilters(state => ({
          ...state,
          difficulty: previousDifficulty
        }))
      }

      if (previousCategories) {
        setPlayFilters(state => ({
          ...state,
          categories: previousCategories
        }))
      }
    }
  }, [storageIsAvailable])

  // store object
  const store: IGlobalContext = {
    userStatus,
    storageIsAvailable: storageIsAvailable,
    setUserStatus,
    playFilters,
    setPlayFilters
  };

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  );
}
