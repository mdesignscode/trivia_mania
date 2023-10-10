import Question from "@/app/game/components";
import { renderGameContext } from "@/utils/test_game_context";
import { screen } from "@/utils/test_utils";
import { mockQuestion } from "./test_question.spec";

describe("Question component", () => {
  it("Should render <RenderQuestion />", async () => {
    renderGameContext(<Question questionObj={mockQuestion} index={1} />);

    const container = await screen.findByTestId("question-container");
    expect(container).toBeInTheDocument();
  });
});
