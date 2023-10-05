import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios"; // You might want to use a mock for axios
import HandleUnsavedProgress from "@/components/handleUnsavedProgress";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import { GlobalProvider } from "@/app/store";

// Mock axios post request for testing
jest.mock("axios");

jest.mock("@/components/localStorageDetection");

// Mock the useUser hook
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "mockedUserId" },
  }),
}));

describe("HandleUnsavedProgress", () => {
  const mockUnsavedProgress: IUserStats = {
      total: {
        correctAnswered: 1,
        answered: 1,
      },
      easy: {
        answered: 1,
        correctAnswered: 1,
      } as DifficultyStat,
      Science: {
        easy: {
          answered: 1,
          correctAnswered: 1,
        } as DifficultyStat,
      } as CategoryStat,
    },
    mockAnsweredQuestions = ["Question1"];

  it("renders when there is unsaved progress", async () => {
    // Mock localStorage data
    localStorage.setItem("unsavedData", JSON.stringify(mockUnsavedProgress));
    localStorage.setItem(
      "answeredQuestions",
      JSON.stringify(mockAnsweredQuestions)
    );

    render(
      <GlobalProvider>
        <HandleUnsavedProgress />
      </GlobalProvider>
    );

    const container = await screen.findByTestId("handle-unsaved-progress-container")
    expect(container).toBeInTheDocument()


    // Assert that the component renders
    // expect(getByTestId("handle-unsaved-progress-container")).toBeInTheDocument();

    // // Simulate a click on the "Save progress" button
    // fireEvent.click(getByTestId("save-progress-button"));

    // Assert that the axios.post function was called (you may need to adjust this based on your axios mock)
    // expect(axios.post).toHaveBeenCalled();
  });

  // it('does not render when there is no unsaved progress', () => {
  //   const { queryByText } = render(<HandleUnsavedProgress />);

  //   // Assert that the component does not render
  //   expect(queryByText('You have unsaved progress.')).toBeNull();
  // });
});
