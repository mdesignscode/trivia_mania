import Question from "@/app/game/components";
import { mockQuestion } from "@/utils/mockData";
import { renderGameContext } from "@/utils/test_game_context";
import { screen } from "@/utils/test_utils";

describe("Question component", () => {
  it("Should render <RenderQuestion />", async () => {
    renderGameContext(<Question questionObj={mockQuestion} index={1} />);

    const container = await screen.findByTestId("question-container");
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderGameContext(<Question questionObj={mockQuestion} index={1} />);
    expect(baseElement).toMatchSnapshot();
  });
});
