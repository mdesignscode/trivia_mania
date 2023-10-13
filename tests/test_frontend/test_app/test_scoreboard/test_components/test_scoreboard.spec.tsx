import Board from "@/app/scoreboard/components/scoreboard";
import User from "@/models/user";
import { mockUser } from "@/utils/test_global_context";
import { screen, render } from "@/utils/test_utils";

// mock props
export const mockTopTenUsers = [
  mockUser,
  { ...mockUser, id: "mockUser2" } as User,
];

describe("Board component", () => {
  it("Should render a list of top ten users' stats", async () => {
    // render component
    render(<Board topTenUsers={mockTopTenUsers} />);

    // get elements frm DOM
    const container = await screen.findByTestId("scoreboard-container"),
      text = await screen.findByText("Top 10 Scoreboard"),
      stat1 = await screen.findByTestId("user-0-stat"),
      stat2 = await screen.findByTestId("user-1-stat");

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(stat1).toBeInTheDocument();
    expect(stat2).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = render(<Board topTenUsers={mockTopTenUsers} />);
    expect(baseElement).toMatchSnapshot();
  });
});
