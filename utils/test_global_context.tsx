import {
  GlobalContext,
  IGlobalContext,
} from "@/app/store";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import User from "@/models/user";
import { render } from "./test_utils";
import { ReactElement } from "react";
import Providers from "@/app/providers";

jest.mock("@tanstack/react-query");

jest.mock("@/components/localStorageDetection", () => true);

// create mock user
export const mockUser = new User("mock user");

// setup context values
export const mockGlobalContext: IGlobalContext = {
  userStatus: {
    user: mockUser,
    isOnline: true,
    isLoaded: true,
  },
  storageIsAvailable: true,
  setUserStatus: jest.fn(),
  playFilters: {
    difficulty: "",
    categories: "",
  },
  setPlayFilters: jest.fn(),
};

export const mockInitialProgress: IUserStats = {
  total: {
    correctAnswered: 1,
    answered: 1,
  },
  easy: {
    answered: 1,
    correctAnswered: 1,
  } as DifficultyStat,
  Science: {
    easy: {
      answered: 1,
      correctAnswered: 1,
    } as DifficultyStat,
  } as CategoryStat,
};

export const renderGlobalContext = (ui: ReactElement) => {
  return render(
    <Providers>
      <GlobalContext.Provider value={mockGlobalContext}>
        {ui}
      </GlobalContext.Provider>
    </Providers>
  );
};
