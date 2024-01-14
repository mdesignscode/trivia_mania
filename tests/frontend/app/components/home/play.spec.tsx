import Play from "@/components/home/play";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

describe("Play component", () => {
  const mockFilters = {
    difficulty: "hard",
    categories: ["Mock category 1", "Mock category 2"],
  };
  const mockData = {
    playFilters: mockFilters,
    playUrl: encodeURI(
      `/game?difficulty=${
        mockFilters.difficulty
      }&categories=${mockFilters.categories.join(",")}`
    ),
  };

  it("Should render a play button", () => {
    // render component
    renderWithNoNavigationError(false, () => {
      const container = screen.getByTestId("play-link");
      expect(container).toBeInTheDocument();
    });
  });

  it("Should add filters to local storage on click", () => {
    // prepare user interaction
    const user = userEvent.setup();

    // render component
    renderWithNoNavigationError(true, async () => {
      // get button from DOM
      const playButton = screen.getByTestId("play-button");

      // click button
      await user.click(playButton);

      // get filters from local storage
      const localDifficulty = localStorage.getItem("difficulty") as string;
      const localCategories = localStorage.getItem("categories") as string;

      // mock filters should be saved to localStorage
      expect(localDifficulty).toBe(mockFilters.difficulty);
      expect(localCategories).toBe(mockFilters.categories.join(","));
    });
  });

  it("Should redirect to the game page with filters as query params", () => {
    // render component
    renderWithNoNavigationError(true, async () => {
      // prepare user interaction
      const user = userEvent.setup();
      // get button from DOM
      const playButton = screen.getByTestId("play-button");
      const link = screen.getByTestId("play-link");

      // simulate click event using userEvent
      await user.click(playButton);

      expect(link).toHaveAttribute(
        "href",
        encodeURI(
          `/game?difficulty=${
            mockFilters.difficulty
          }&categories=${mockFilters.categories.join(",")}`
        )
      );
    });
  });

  it("snapshot matches", () => {
    // render component
    try {
      const { baseElement } = renderHomeContext(<Play />, {}, mockData);
      expect(baseElement).toMatchSnapshot();
    } catch (error: any) {
      if (error.message.includes("Not implemented: navigation")) {
        // Suppress the error
      }
    }
  });

  function renderWithNoNavigationError(hasParentData = false, cb: Function) {
    try {
      hasParentData
        ? renderHomeContext(<Play />, {}, mockData)
        : renderHomeContext(<Play />);

      cb();
    } catch (error: any) {
      if (error.message.includes("Not implemented: navigation")) {
        // Suppress the error
      }
    }
  }
});
