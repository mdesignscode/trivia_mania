import { GameProvider } from "@/app/context/gameContext";
import { GlobalProvider } from "@/app/context/globalContext";
import RenderQuestion, {
  IRenderQuestion,
  decodeHTMLEntities,
} from "@/app/game/components/question";
import useFetchQuestionsList from "@/hooks/fetchQuestionsList";
import { QUESTION_ANSWERED } from "@/utils/localStorage_utils";
import { mockQuestion } from "@/utils/mockData";
import {
  mockSubmitProgress,
  renderGameContext,
} from "@/utils/test_game_context";
import { screen, userEvent, render, renderHook } from "@/utils/test_utils";

// spy functions
const mockHandleNextQuestion = jest.fn(),
  mockHandleTimesUp = jest.fn(),
  mockHandleViewProgress = jest.fn(),
  mockHandleUserAnswer = jest.fn(),
  mockContinueLater = jest.fn();

// mock props
const mockProps: IRenderQuestion = {
  userAnswer: "",
  timesUp: false,
  timerHasStarted: true,
  index: 1,
  CTA: "Next Question",
  answerFeedback: [false, false, false, false],
  handleNextQuestion: mockHandleNextQuestion,
  handleTimesUp: mockHandleTimesUp,
  handleUserAnswer: mockHandleUserAnswer,
  handleViewProgress: mockHandleViewProgress,
  questionObj: mockQuestion,
  handleContinueLater: mockContinueLater,
};

describe("RenderQuestion component", () => {
  it("Should render a question for a user to answer", async () => {
    // render question
    renderGameContext(<RenderQuestion {...mockProps} />);

    // get elements from DOM
    const container = await screen.findByTestId("question-container"),
      question = await screen.findByText(
        decodeHTMLEntities(mockQuestion.question)
      ),
      easy = await screen.findByText("easy"),
      category = await screen.findByText(mockQuestion.category),
      timer = await screen.findByTestId("timer-container");

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(question).toBeInTheDocument();
    expect(easy).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(timer).toBeInTheDocument();

    // assert answer buttons are in DOM
    for (const entity of mockQuestion.answers) {
      const answer = decodeHTMLEntities(entity);
      const button = await screen.findByText(answer);

      expect(button).toBeInTheDocument();
    }
  });

  it("Should gracefully handle user answer", async () => {
    // setup user interaction
    const user = userEvent.setup();

    // render question
    renderGameContext(<RenderQuestion {...mockProps} />);

    // find an answer button to click
    const randomValue = Math.floor(Math.random() * 4),
      randomAnswerValue = decodeHTMLEntities(mockQuestion.answers[randomValue]);
    const randomAnswer = await screen.findByText(randomAnswerValue);

    expect(randomAnswer).toBeInTheDocument();

    // answer question
    await user.click(randomAnswer);

    // assert answer handling
    expect(mockHandleUserAnswer).toBeCalledWith(randomAnswerValue, randomValue);
  });

  it("Should save a user's progress on clicking `View Progress` or `Submit Results`", async () => {
    // setup user interaction
    const user = userEvent.setup();

    // render question with props to simulate `View Progress`
    const { rerender } = renderGameContext(
      <RenderQuestion
        {...{
          ...mockProps,
          CTA: "Continue Playing",
          timesUp: true,
          timerHasStarted: false,
        }}
      />
    );

    // find `View Progress` button
    const viewProgressButton = await screen.findByText("View Progress");
    expect(viewProgressButton).toBeInTheDocument();

    // click button
    await user.click(viewProgressButton);

    expect(mockHandleViewProgress).toBeCalled();

    // rerender question with props to simulate `Submit Results`
    rerender(
      <RenderQuestion
        {...{
          ...mockProps,
          CTA: "Submit Results",
          timesUp: true,
          timerHasStarted: false,
        }}
      />
    );

    // find `Submit Results` button
    const sumbitResultsButton = await screen.findByText("Submit Results");
    expect(sumbitResultsButton).toBeInTheDocument();

    // click button
    await user.click(sumbitResultsButton);

    expect(mockHandleNextQuestion).toBeCalled();
  });

  it("Shifts the questions pool to the right and saves a user's progress on clicking `Continue Later`", async () => {
    // setup user interaction
    const user = userEvent.setup();

    // renderGameContext(<RenderQuestion {...mockProps} />);

    render(
      <GlobalProvider>
        <GameProvider>
          <RenderQuestion {...mockProps} />
        </GameProvider>
      </GlobalProvider>
    );

    const continueLaterButton = await screen.findByTestId(
      "continue-later-button"
    );
    expect(continueLaterButton).toBeInTheDocument();

    await user.click(continueLaterButton);

    expect(mockContinueLater).toBeCalled();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderGameContext(
      <RenderQuestion {...mockProps} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
