import DisplayStats from "@/app/users/[id]/components/displayStats";
import { mockInitialProgress } from "@/utils/test_global_context";
import { screen, render } from "@/utils/test_utils";

describe("DisplayStats component", () => {
  it("Should render a list of user stats", async () => {
    // render component
    render(<DisplayStats message="Mock Message" stats={mockInitialProgress} />);

    // should have text passed in as prop
    const message = await screen.findByText("Mock Message");
    expect(message).toBeInTheDocument();

    const container = await screen.findByTestId("stats-container");
    expect(container).toBeInTheDocument();

    // should have an entry for difficulty
    const easy = await screen.findByText("Easy");
    expect(easy).toBeInTheDocument();

    // and an entry for category
    const science = await screen.findByText("Science");
    expect(science).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = render(
      <DisplayStats message="Mock Message" stats={mockInitialProgress} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
