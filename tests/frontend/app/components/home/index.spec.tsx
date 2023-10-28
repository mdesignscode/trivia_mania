import HomePage from "@/components/home";
import {
  mockCategoryStats,
  mockDifficultyStats,
  mockEasyStats,
  mockHardStats,
  mockMediumStats,
} from "@/utils/mockData";
import {
  mockGetQuestionStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

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
  it("Renders <Welcome />", async () => {
    const { baseElement } = renderHomeContext(<HomePage />, {
      currentUI: {
        welcome: true,
        difficulties: false,
        categories: false,
        play: false,
      },
    });

    // get child components' containers
    const container = await screen.findByTestId("home-container"),
      welcomeContainer = await screen.findByTestId("welcome-container"),
      continueButton = await screen.findByTestId("welcome-continue-button");

    expect(container).toBeInTheDocument();
    expect(welcomeContainer).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders <Difficulties />", async () => {
    const { baseElement } = renderHomeContext(<HomePage />, {
      currentUI: {
        welcome: false,
        difficulties: true,
        categories: false,
        play: false,
      },
    });

    // get difficulties container
    const difficultiesContainer = await screen.findByTestId(
        "render-difficulties-container"
      ),
      container = await screen.findByTestId("home-container");

    expect(container).toBeInTheDocument();
    expect(difficultiesContainer).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it("Renders <Difficulties />, <Categories /> and <Play />", async () => {
    const { baseElement } = renderHomeContext(<HomePage />, {
      currentUI: {
        welcome: false,
        difficulties: true,
        categories: true,
        play: true,
      },
      showCategories: true,
    });

    // get child components' containers
    const container = await screen.findByTestId("home-container"),
      categoriesContainer = await screen.findByTestId(
        "render-categories-container"
      ),
      playLink = await screen.findByTestId("play-link"),
      difficultiesContainer = await screen.findByTestId(
        "render-difficulties-container"
      );

    // assert containers are in DOM
    expect(container).toBeInTheDocument();
    expect(difficultiesContainer).toBeInTheDocument();
    expect(categoriesContainer).toBeInTheDocument();
    expect(playLink).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it("Should gracefully handle user interaction", async () => {
    const user = userEvent.setup();

    renderHomeContext(<HomePage />, {
      categoryStats: mockCategoryStats,
      currentUI: {
        welcome: false,
        difficulties: true,
        categories: true,
        play: true,
      },
      showCategories: true,
    });

    // a list of difficulty buttons should be displayed
    for (const key of Object.keys(mockDifficultyStats)) {
      const button = await screen.findByTestId(key);

      expect(button).toBeInTheDocument();
    }

    // a list of category buttons should be displayed
    for (const key of Object.keys(mockCategoryStats)) {
      const button = await screen.findByTestId(key);

      expect(button).toBeInTheDocument();
    }

    const easy = await screen.findByTestId("easy");

    await user.click(easy);

    expect(mockGetQuestionStats).toBeCalledWith("easy");
  });

  it("Should show more categories on clicking `More categories`", async () => {
    const user = userEvent.setup();

    renderHomeContext(<HomePage />, {
      currentUI: {
        welcome: false,
        difficulties: true,
        categories: true,
        play: true,
      },
      showCategories: true,
    });

    const showMore = await screen.findByTestId("show-more-button");

    await user.click(showMore);

    const container = await screen.findByTestId("second-categories-set");
    expect(container).toBeInTheDocument();
  });
});
