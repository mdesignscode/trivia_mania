import Board from "@/app/scoreboard/components/scoreboard";
import { initialStat } from "@/models/interfaces";
import User from "@/models/user";
import { mockInitialProgress } from "@/utils/mockData";
import { mockUser } from "@/utils/test_global_context";
import { screen, render } from "@/utils/test_utils";

beforeEach(() => {
  mockUser.stats = mockInitialProgress;
});

afterAll(() => {
  mockUser.stats = initialStat;
});

// mock props
export const mockTopTenUsers = [
  mockUser,
  {
    ...mockUser,
    id: "mockUser2",
    username: "mock user 2",
    stats: mockInitialProgress,
  } as User,
];

describe("Board component", () => {
  it("Should render a list of top ten users' stats", async () => {
    // render component
    render(<Board topTenUsers={mockTopTenUsers} />);

    // get elements from DOM
    const container = await screen.findByTestId("scoreboard-container"),
      text = await screen.findByText("Top 10 Scoreboard"),
      stat1 = await screen.findByTestId("user-0-stat"),
      stat2 = await screen.findByTestId("user-1-stat");

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(stat1).toBeInTheDocument();
    expect(stat2).toBeInTheDocument();

    // get categories stats
    const scienceStats = await screen.findByTestId("mock user-Science");
    expect(scienceStats).toBeInTheDocument();
    const scienceStats2 = await screen.findByTestId("mock user 2-Science");
    expect(scienceStats2).toBeInTheDocument();

    expect(scienceStats).toHaveTextContent(/Science Correct AnswersEasy:1/)
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = render(<Board topTenUsers={mockTopTenUsers} />);
    expect(baseElement).toMatchSnapshot();
  });
});
