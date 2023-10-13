import Play from "@/components/home/play";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

describe("Play component", () => {
  const mockFilters = {
    difficulty: "hard",
    categories: ["Mock category 1", "Mock category 2"],
  };

  it("Should render a play button", async () => {
    // render component
    renderHomeContext(<Play />, mockFilters);

    const container = await screen.findByTestId("play-link");
    expect(container).toBeInTheDocument();
  });

  it("Should add filters to local storage on click", async () => {
    // prepare user interaction
    const user = userEvent.setup();

    // render component
    renderHomeContext(<Play />, mockFilters);

    // get button from DOM
    const playButton = await screen.findByTestId("play-button");

    // click button
    await user.click(playButton);

    // get filters from local storage
    const localDifficulty = localStorage.getItem("difficulty") as string;
    const localCategories = localStorage.getItem("categories") as string;

    // mock filters should be saved to localStorage
    expect(localDifficulty).toBe(mockFilters.difficulty);
    expect(localCategories).toBe(mockFilters.categories.join(","));
  });

  it("Should redirect to the game page with filters as query params", async () => {
    // prepare user interaction
    const user = userEvent.setup();

    // render component
    renderHomeContext(<Play />, mockFilters);

    // get button from DOM
    const playButton = await screen.findByTestId("play-button");
    const link = await screen.findByTestId("play-link");

    // simulate click event using userEvent
    await user.click(playButton);

    expect(link).toHaveAttribute(
      "href",
      encodeURI(`/game?difficulty=${
        mockFilters.difficulty
      }&categories=${mockFilters.categories.join(",")}`)
    );
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(<Play />, mockFilters);
    expect(baseElement).toMatchSnapshot();
  });
});
