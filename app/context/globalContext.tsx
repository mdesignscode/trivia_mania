"use client";

import storageAvailable from "@/components/localStorageDetection";
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
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
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
  userStatus: IUserStatus;
  storageIsAvailable: boolean;
  setPlayFilters: (
    cb: (state: { difficulty: string; categories: string }) => {
      difficulty: string;
      categories: string;
    }
  ) => void;
  playFilters: TFilters;
  playUrl: string;
  setPageReady: (state: boolean) => void;
  pageReady: boolean;
  difficultyChoice: Record<string, boolean>;
  setDifficultyChoice: Dispatch<SetStateAction<Record<string, boolean>>>;
  categoryChoice: boolean[];
  setCategoryChoice: Dispatch<SetStateAction<boolean[]>>;
}

export const initialGlobalContext: IGlobalContext = {
  userStatus: {
    user: null as User | null,
    isOnline: false,
    isLoaded: false,
  },
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
  const [_playFilters, _setPlayFilters] = useState({
    difficulty: "",
    categories: "",
  });
  const playFilters = useRef(_playFilters);
  function setPlayFilters(
    cb: (state: typeof playFilters.current) => typeof playFilters.current
  ) {
    playFilters.current = cb(playFilters.current);
    _setPlayFilters(cb(playFilters.current));
  }
  const playUrl = encodeURI(
    `/game?difficulty=${playFilters.current.difficulty}&categories=${playFilters.current.categories}`
  );

  const [_pageReady, _setPageReady] = useState(false);
  const pageReady = useRef(_pageReady);
  function setPageReady(state: boolean) {
    pageReady.current = state;
    _setPageReady(state);
  }

  const { user, isLoaded, isSignedIn } = useUser();
  const [fetchUser, setFetchUser] = useState(true);

  // detect user online
  const [userOnline, setUserOnline] = useState(false);
  useEffect(() => {
    if (!userOnline && userStatus.user) {
      // user status has changed and online user should be set
      setFetchUser(true);
      setUserOnline(true);
    }
  }, [userStatus.user, userOnline]);

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
    if (fetchUser) {
      if (isLoaded) {
        if (isSignedIn && storageIsAvailable) {
          // fetch user
          setUserId(user.id);
          setShouldFetchUser(true);

          if (isFetched) {
            setFetchUser(false);
            // set online user
            const triviaUser = data;
            setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });
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
        } else if (!storageIsAvailable && isSignedIn) {
          // fetch user
          setUserId(user.id);
          setShouldFetchUser(true);

          if (isFetched) {
            // set online user
            const triviaUser = data;
            setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });
            setFetchUser(false);
          }
        } else {
          setUserStatus({ user: null, isLoaded: true, isOnline: false });
          setFetchUser(false);
        }
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    storageIsAvailable,
    isFetched,
    user,
    data,
    fetchUser,
  ]);

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
    userStatus,
    storageIsAvailable: storageIsAvailable,
    playFilters: playFilters.current,
    setPlayFilters: setPlayFilters,
    playUrl,
    pageReady: pageReady.current,
    setPageReady,
    setDifficultyChoice,
    difficultyChoice,
    setCategoryChoice,
    categoryChoice,
  };

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  );
}
