import Hero from "@/app/users/[id]/components/hero";
import { mockUser } from "@/utils/test_global_context";
import { screen, render } from "@/utils/test_utils";

describe("Hero component", () => {
  it("Should render information regarding a user's progress", async () => {
    // render component
    render(<Hero topTenPosition={1} userStats={mockUser.stats} />);

    // get elements from DOM
    const headings = await screen.findAllByRole("heading");

    // assert display values
    expect(headings[0]).toHaveTextContent("This is your progress");
    expect(headings[1]).toHaveTextContent(
      "Congratulations you are number 1 in the Leader board"
    );
    expect(headings[2]).toHaveTextContent(
      `Total questions answered: ${mockUser.stats.total.answered}`
    );
    expect(headings[3]).toHaveTextContent(
      `Total correct answers: ${mockUser.stats.total.correctAnswered}`
    );
  });

  it("Should render information regarding a user's progress", async () => {
    // render component
    render(<Hero topTenPosition={1} userStats={mockUser.stats} />);

    // get elements from DOM
    const headings = await screen.findAllByRole("heading");

    // assert display values
    expect(headings[0]).toHaveTextContent("This is your progress");
    expect(headings[1]).toHaveTextContent(
      "Congratulations you are number 1 in the Leader board"
    );
    expect(headings[2]).toHaveTextContent(
      `Total questions answered: ${mockUser.stats.total.answered}`
    );
    expect(headings[3]).toHaveTextContent(
      `Total correct answers: ${mockUser.stats.total.correctAnswered}`
    );
  });

  it("Should not display user position if not in top ten", async () => {
    // render component
    render(<Hero topTenPosition={0} userStats={mockUser.stats} />);

    const headings = await screen.findAllByRole("heading");
    expect(headings).toHaveLength(3);
  });
});
