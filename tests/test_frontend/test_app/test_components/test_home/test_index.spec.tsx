import HomePage from "@/components/home";
import { screen, render, userEvent } from "@/utils/test_utils";
import {
  mockCategoryStats,
  mockDifficultyStats,
  mockEasyStats,
  mockHardStats,
  mockMediumStats,
} from "./mockData";
import {
  mockGetQuestionStats,
  renderHomeContext,
} from "@/utils/test_home_context";

// mock axios post to return different stats
jest.mock("axios", () => ({
  post: (url: string, body: any) => {
    if (body.difficulty == null) return { data: mockDifficultyStats };

    const difficulty = body.difficulty;

    switch (difficulty) {
      case "easy":
        return { data: mockEasyStats };

      case "medium":
        return { data: mockMediumStats };

      case "hard":
        return { data: mockHardStats };

      default:
        return { data: mockCategoryStats };
    }
  },
}));

describe("HomePage component", () => {
  it("Renders the Home page", async () => {
    render(<HomePage />);

    // get child components' containers
    const container = await screen.findByTestId("home-container"),
      headerContainer = await screen.findByTestId("header-container"),
      difficultiesContainer = await screen.findByTestId(
        "render-difficulties-container"
      ),
      categories = await screen.findByTestId("render-categories-container"),
      playButton = await screen.findByTestId("play-link"),
      footerContainer = await screen.findByTestId("footer-container");

    expect(container).toBeInTheDocument();
    expect(headerContainer).toBeInTheDocument();
    expect(difficultiesContainer).toBeInTheDocument();
    expect(categories).toBeInTheDocument();
    expect(playButton).toBeInTheDocument();
    expect(footerContainer).toBeInTheDocument();
  });

  it("Should gracefully handle user interaction", async () => {
    const user = userEvent.setup();

    renderHomeContext(<HomePage />, {
      categoryStats: mockCategoryStats,
    });

    // a list of difficulty buttons should be displayed
    for (const key of Object.keys(mockDifficultyStats)) {
      const difficultyKey = `${key} (${mockDifficultyStats[key]})`;
      const button = await screen.findByText(difficultyKey);

      expect(button).toBeInTheDocument();
    }

    // a list of category buttons should be displayed
    for (const key of Object.keys(mockCategoryStats)) {
      const categoryKey = `${key} (${mockCategoryStats[key]})`;
      const button = await screen.findByText(categoryKey);

      expect(button).toBeInTheDocument();
    }

    const easy = await screen.findByText("easy (3)");

    await user.click(easy);

    expect(mockGetQuestionStats).toBeCalledWith("easy");
  });

  it("Should show more categories on clicking `More categories`", async () => {
    const user = userEvent.setup();

    renderHomeContext(<HomePage />);

    const showMore = await screen.findByTestId("show-more-button");

    await user.click(showMore);

    const container = await screen.findByTestId("second-categories-set");
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toMatchSnapshot();
  });
});
