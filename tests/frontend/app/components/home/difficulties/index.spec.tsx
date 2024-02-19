import Difficulties from "@/components/home/difficulties";
import { IInitialStats } from "@/hooks/initialStats";
import { mockDifficultyStats } from "@/utils/mockData";
import {
  mockCategoriesStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

// mock custom hook `useInititialStats`
jest.mock("@/hooks/initialStats", () => {
  return jest.fn(
    () =>
      ({
        difficultyStats: mockDifficultyStats,
        categoryStats: mockCategoriesStats,
        previousDifficulty: "",
      })
  );
});

describe("RenderDifficulties component", () => {
  it("should render the `RenderCategories` component", async () => {
    renderHomeContext(<Difficulties />, {
      currentUI: {
        welcome: false,
        difficulties: true,
        categories: false,
        play: false,
      },
    });
    const container = await screen.findByTestId(
      "render-difficulties-container"
    );
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(<Difficulties />, {currentUI: {
      welcome: false,
      difficulties: true,
      categories: false,
      play: false,
    }});
    expect(baseElement).toMatchSnapshot();
  });
});
