"use client";

import { createContext, useEffect, useState } from "react";
import storageAvailable from "./components/localStorageDetection";
import User from "@/models/user";

interface IUserStats {
  user: User | null;
  isOnline: boolean;
  isLoaded: boolean;
}

interface IGlobalContext {
  userStatus: IUserStats;
  setUserStatus: (state: IUserStats) => void;
  storageIsAvailable: boolean;
  isPrevUser: boolean;
  setIsPrevUser: (state: boolean) => void;
}

const initialContext: IGlobalContext = {
  userStatus: {
    user: null as User | null,
    isOnline: false,
    isLoaded: false,
  },
  storageIsAvailable: false,
  setUserStatus: () => {},
  isPrevUser: true,
  setIsPrevUser: () => {},
};
export const GlobalContext = createContext<IGlobalContext>(initialContext);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  // global state
  // app uses localStorage
  const [storageIsAvailable, setStorageIsAvailable] = useState(false);
  const [userStatus, setUserStatus] = useState({
    user: null as User | null,
    isOnline: false,
    isLoaded: false,
  });
  const [isPrevUser, setIsPrevUser] = useState(true);

  useEffect(() => {
    // detect storage feature
    setStorageIsAvailable(storageAvailable());
  }, []);

  // store object
  const store: IGlobalContext = {
    userStatus,
    storageIsAvailable: storageIsAvailable,
    setUserStatus,
    isPrevUser,
    setIsPrevUser
  };

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  );
}
