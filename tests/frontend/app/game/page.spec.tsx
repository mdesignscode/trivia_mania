import GamePage from "@/app/game/page";
import {
  mockSetNewFilters,
  mockSetPlayFilters,
  renderGlobalContext,
} from "@/utils/test_global_context";

describe("GamePage component", () => {
  it("Sets new filters state if search params are different from state filters", async () => {
    renderGlobalContext(<GamePage />, {
      playFilters: {
        difficulty: "hard",
        categories: "Mock Category 2",
      },
    });

    expect(mockSetNewFilters).toBeCalledWith(true);
    expect(mockSetPlayFilters).toBeCalled();
  });
});
