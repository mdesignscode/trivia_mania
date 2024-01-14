import { GlobalContext, IGlobalContext } from "@/context/globalContext";
import QueryProvider from "@/context/queryProvider";
import User from "@/models/user";
import { ReactElement } from "react";
import { render } from "./test_utils";

// mock animations to render a consistent UI
jest.mock("framer-motion", () => ({
  motion: {
    div: function (props: any) {
      return (
        <div className={props.className} data-testid={props["data-testid"]}>
          {props.children}
        </div>
      );
    },
    span: function (props: any) {
      return (
        <span
          className={props.className}
          onClick={props.onClick}
          data-testid={props["data-testid"]}
        >
          {props.children}
        </span>
      );
    },
  },
}));

jest.mock("@tanstack/react-query");

jest.mock("@clerk/nextjs");

// spy functions
export const mockSetPlayFilters = jest.fn(),
  mockSetPageReady = jest.fn(),
  mockSetDifficultyChoice = jest.fn(),
  mockSetCategoryChoice = jest.fn(),
  mockSetPlayerMode = jest.fn()

// create mock user
export const mockUser = new User("mock user", "mockId");

// setup context values
export const mockGlobalContext: IGlobalContext = {
  triviaUser: mockUser,
  storageIsAvailable: true,
  playFilters: {
    difficulty: "",
    categories: "",
  },
  setPlayFilters: mockSetPlayFilters,
  playUrl: "/game?difficulty=&categories=",
  setPageReady: mockSetPageReady,
  categoryChoice: [],
  setDifficultyChoice: mockSetDifficultyChoice,
  setCategoryChoice: mockSetCategoryChoice,
  pageReady: true,
  difficultyChoice: {
    easy: false,
    hard: false,
    medium: false,
    "all difficulties": false,
  },
  playerMode: "Guest",
  setPlayerMode: mockSetPlayerMode
};

// wrapper for rendering custom hooks
export function GlobalWrapper(customData?: Record<string, any>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <GlobalContext.Provider
        value={
          customData
            ? { ...mockGlobalContext, ...customData }
            : mockGlobalContext
        }
      >
        {children}
      </GlobalContext.Provider>
    );
  };
}

export const renderGlobalContext = (
  ui: ReactElement,
  customData: Record<string, any> = {}
) => {
  const value = {
    ...mockGlobalContext,
    ...customData,
  };

  return render(
    <QueryProvider>
      <GlobalContext.Provider value={value}>{ui}</GlobalContext.Provider>
    </QueryProvider>
  );
};
