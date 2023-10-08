import RenderDifficulties from "@/components/home/difficulties/renderDifficulties";
import { IInitialStats } from "@/hooks/inititialStats";
import {
  mockCategoriesStats,
  mockGetQuestionStats,
  mockSetDifficulty,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

// create mock data
export const mockDifficultyStats: Record<string, number> = {
    easy: 10,
    hard: 16,
    medium: 8,
    "all difficulties": 34,
  },
  mockDifficultyChoice = {
    easy: false,
    medium: false,
    hard: false,
    "all difficulties": false,
  },
  mockHander = jest.fn();

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
  it("Should render a list of difficulty buttons", async () => {
    const user = userEvent.setup();

    // render component
    renderHomeContext(
      <RenderDifficulties
        difficultyChoice={mockDifficultyChoice}
        handleDifficulty={mockHander}
      />
    );

    // get elements from DOM
    const container = await screen.findByTestId(
        "render-difficulties-container"
      ),
      text = await screen.findByText("Choose difficulty");

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    // should call the event handler on click
    Object.keys(mockDifficultyStats).forEach(async (key) => {
      // get button
      const buttonValue = `${key} (${mockDifficultyStats[key]})`;

      const difficultyButton = await screen.findByDisplayValue(buttonValue);

      // check if button is present
      expect(difficultyButton).toBeInTheDocument();
      // fire button
      await user.click(difficultyButton);

      // assert event was hadled as expected
      const value = key === "all difficulties" ? "" : key;
      expect(mockHander).toBeCalledWith(value);
      expect(mockSetDifficulty).toBeCalledWith(key);
      expect(mockGetQuestionStats).toBeCalled();
    });
  });
});
