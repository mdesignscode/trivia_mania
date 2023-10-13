import Difficulties from "@/components/home/difficulties";
import { IInitialStats } from "@/hooks/inititialStats";
import { mockCategoriesStats, renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";
import { mockDifficultyStats } from "./test_renderDifficulties.spec";

// mock custom hook `useInititialStats`
jest.mock("@/hooks/inititialStats", () => {
  return jest.fn(
    () =>
      ({
        difficultiesLoading: false,
        difficultyStats: mockDifficultyStats,
        categoryStats: mockCategoriesStats,
        categoriesLoading: false,
        previousDifficulty: "",
      } as IInitialStats)
  );
});

describe("RenderDifficulties component", () => {
  it("should render the `RenderCategories` component", async () => {
    renderHomeContext(<Difficulties />);
    const container = await screen.findByTestId(
      "render-difficulties-container"
    );
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
  // render component
  const { baseElement } = renderHomeContext(<Difficulties />);
  expect(baseElement).toMatchSnapshot();
  });
});
