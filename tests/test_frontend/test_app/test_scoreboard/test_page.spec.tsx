import ScoreBoard from "@/app/scoreboard/page";
import storage from "@/models/index";
import { screen, render } from "@/utils/test_utils"
import { mockTopTenUsers } from "./test_components/test_scoreboard.spec";

// Mock the storage module
jest.mock('@/models/index', () => ({
  getTopTenUsers: jest.fn(() => mockTopTenUsers),
}));

describe("ScoreBoard component", () => {
  it("Should render <Board />", async () => {
    // wait for component to be rendered on server
    const Component = await ScoreBoard()

    // render component
    render(Component)

    // assert behaviour
    const container = await screen.findByTestId("scoreboard-container")
    expect(container).toBeInTheDocument()
    expect(storage.getTopTenUsers).toBeCalled()
  })
});
