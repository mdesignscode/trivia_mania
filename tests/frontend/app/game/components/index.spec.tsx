import Question from "@/app/game/components";
import {
  QUESTION_ANSWERED
} from "@/utils/localStorage_utils";
import { mockQuestion } from "@/utils/mockData";
import { renderGameContext } from "@/utils/test_game_context";
import { screen } from "@/utils/test_utils";

describe("Question component", () => {
  it("Should render <RenderQuestion />", async () => {
    renderGameContext(<Question questionObj={mockQuestion} index={1} />);

    const container = await screen.findByTestId("question-container");
    expect(container).toBeInTheDocument();
  });

  it("Answer buttons is not disabled if current question has already been answered", async () => {
    // set flag in local storage
    localStorage.setItem(QUESTION_ANSWERED, "false");

    const { baseElement } = renderGameContext(
      <Question questionObj={mockQuestion} index={1} />
    );

    // get an answer button from DOM to see if disabled
    const answerButton = await screen.findByTestId("Mock Correct Answer");
    expect(answerButton.children[0]).not.toHaveAttribute("disabled", "");

    expect(baseElement).toMatchSnapshot();
  });

  it("Disables answer buttons if current question has already been answered", async () => {
    // set flag in local storage
    localStorage.setItem(QUESTION_ANSWERED, "true");

    const { baseElement } = renderGameContext(
      <Question questionObj={mockQuestion} index={1} />
    );

    // get an answer button from DOM to see if disabled
    const answerButton = await screen.findByTestId("Mock Correct Answer");
    expect(answerButton.children[0]).toHaveAttribute("disabled", "");

    // feedback should be displayed based on previous answer
    const feedbackIncorrect = await screen.findByTestId("feedback-correct-3"),
      feedbackCorrect = await screen.findByTestId("feedback-incorrect-0");

    expect(feedbackIncorrect).toBeInTheDocument();
    expect(feedbackCorrect).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderGameContext(
      <Question questionObj={mockQuestion} index={1} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
