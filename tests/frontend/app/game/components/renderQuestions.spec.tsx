import RenderQuestions from "@/app/game/components/renderQuestions";
import { mockInitialProgress, mockQuestion } from "@/utils/mockData";
import { renderGameContext } from "@/utils/test_game_context";
import { screen } from "@/utils/test_utils";

// mock context
const mockAdditionalContext = {
  questions: [mockQuestion, { ...mockQuestion, id: "mockId2" }],
  questionIndex: 1,
  questionsLength: 2,
  poolIndex: 0,
};

describe("RenderQuestions component", () => {
  it("Render a list of questions for a user to answer", async () => {
    // render component
    renderGameContext(<RenderQuestions />, mockAdditionalContext);

    // get elements from DOM
    const container = await screen.findByTestId("render-questions-container"),
      text = await screen.findByText("Question 1 of 2"),
      questionContainer = await screen.findByTestId("question-container");

    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(questionContainer).toBeInTheDocument();
  });

  it("Display all questions answered page if user has answered all questions", async () => {
    // render component
    renderGameContext(<RenderQuestions />, {
      ...mockAdditionalContext,
      questionIndex: {},
    });

    // get elements from DOM
    const container = await screen.findByTestId(
      "all-questions-answered-container"
    );

    expect(container).toBeInTheDocument();
  });

  it("Render <HandleUnsaveProgress /> if user has unsaved data", async () => {
    // set unsaved data in local storage
    localStorage.setItem("unsavedData", JSON.stringify(mockInitialProgress));

    // render component
    renderGameContext(<RenderQuestions />, {
      ...mockAdditionalContext,
      questionIndex: {},
    });

    // get elements from DOM
    const container = await screen.findByTestId(
        "all-questions-answered-container"
      ),
      unsavedProgressContainer = await screen.findByTestId(
        "handle-unsaved-progress-container"
      );

    expect(container).toBeInTheDocument();
    expect(unsavedProgressContainer).toBeInTheDocument();
  });

  it("snapshot matches with a list of questions", () => {
    // render component
    const { baseElement } = renderGameContext(
      <RenderQuestions />,
      mockAdditionalContext
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches with all questions answered", () => {
    // render component
    const { baseElement } = renderGameContext(<RenderQuestions />, {
      ...mockAdditionalContext,
      questionIndex: {},
    });

    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches with unsaved data", () => {
    // set unsaved data in local storage
    localStorage.setItem("unsavedData", JSON.stringify(mockInitialProgress));

    // render component
    const { baseElement } = renderGameContext(<RenderQuestions />, {
      ...mockAdditionalContext,
      questionIndex: {},
    });
    expect(baseElement).toMatchSnapshot();
  });
});
