import HandleUnsavedProgress from "@/components/handleUnsavedProgress";
import {
  mockInitialProgress,
  mockUser,
  renderGlobalContext,
} from "@/utils/test_global_context";
import { screen, userEvent } from "@/utils/test_utils";
import axios from "axios";

jest.mock("@/components/reloadPage");

// setup API url
const baseUrl = "mockhost/api";
const url = `${baseUrl}/users/updateStats`;

// setup mock post data
const mockAnsweredQuestions = ["Question1"];

describe("HandleUnsavedProgress component", () => {
  it("renders when there is unsaved progress", async () => {
    // Mock localStorage data
    localStorage.setItem("unsavedData", JSON.stringify(mockInitialProgress));
    localStorage.setItem("answeredQuestions", mockAnsweredQuestions.join(","));

    // setup mock response
    const mockAxios = axios as jest.Mocked<typeof axios>;
    mockAxios.post.mockResolvedValue({
      data: "User stats updated successfully",
    });
    const user = userEvent.setup();

    // render component
    renderGlobalContext(<HandleUnsavedProgress />);

    // get container and buttons from DOM
    const container = await screen.findByTestId(
        "handle-unsaved-progress-container"
      ),
      saveButton = await screen.findByTestId("save-progress-button"),
      discardButton = await screen.findByTestId("discard-progress-button");

    // Assert that the component renders
    expect(container).toBeInTheDocument();

    // Simulate a click on the "Save progress" button
    await user.click(saveButton);

    // Assert that the axios.post function was called with correct body
    expect(axios.post).toHaveBeenCalledWith(url, {
      stats: mockInitialProgress,
      id: mockUser.id,
      answeredQuestions: mockAnsweredQuestions,
    });

    // Simulate a click on the "Save progress" button
    await user.click(discardButton);

    const unsavedData = localStorage.getItem("unsavedData");
    expect(unsavedData).toBeNull();
  });

  it("does not render when there is no unsaved progress", () => {
    // clear unsaved data from localStorage
    localStorage.removeItem("unsavedData");

    const { queryByText } = renderGlobalContext(<HandleUnsavedProgress />);

    // Assert that the component does not render
    expect(queryByText("You have unsaved progress.")).toBeNull();
  });

  it("snapshot matches with unsaved progress", () => {
    // Mock localStorage data
    localStorage.setItem("unsavedData", JSON.stringify(mockInitialProgress));
    localStorage.setItem("answeredQuestions", mockAnsweredQuestions.join(","));

    // setup mock response
    const mockAxios = axios as jest.Mocked<typeof axios>;
    mockAxios.post.mockResolvedValue({
      data: "User stats updated successfully",
    });

    // render component
    const { baseElement } = renderGlobalContext(<HandleUnsavedProgress />);
    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches with no unsaved progress", () => {
    // clear unsaved data from localStorage
    localStorage.removeItem("unsavedData");

    // render component
    const { baseElement } = renderGlobalContext(<HandleUnsavedProgress />);
    expect(baseElement).toMatchSnapshot();
  });
});
