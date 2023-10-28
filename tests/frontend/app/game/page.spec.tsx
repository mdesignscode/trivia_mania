import GamePage from "@/app/game/page";
import {
  mockSetPlayFilters,
  renderGlobalContext,
} from "@/utils/test_global_context";
import { NEW_PARAMS } from "@/utils/localStorage_utils";

// mock `useSearchParams` hook
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (query: string) => {
      return query === "difficulty" ? "easy" : "Mock Category";
    },
  }),
}));

jest.mock("@/context/gameContext");

describe("GamePage component", () => {
  it("Sets new params flag if search params are different from state filters", async () => {
    renderGlobalContext(<GamePage />);

    const localFlag = localStorage.getItem(NEW_PARAMS);

    expect(localFlag).toBe("true");
    expect(mockSetPlayFilters).toBeCalled();
  });

  it("Does not set new params filter if search params are same as state filters", async () => {
    renderGlobalContext(<GamePage />, {
      playFilters: {
        difficulty: "easy",
        categories: "Mock Category",
      },
    });

    const localFlag = localStorage.getItem(NEW_PARAMS);

    expect(localFlag).toBeNull();
  });
});
