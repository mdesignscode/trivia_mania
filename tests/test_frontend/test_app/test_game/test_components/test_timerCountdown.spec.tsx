import Timer from "@/app/game/components/timerCountdown";
import { screen, render } from "@/utils/test_utils";

describe("Timer component", () => {
  it("Displays a timer countdown for answering a question", async () => {
    const mockHandleTimesUp = jest.fn();

    render(<Timer timerHasStarted={false} handleTimesUp={mockHandleTimesUp} />);

    const container = await screen.findByTestId("timer-container");
    expect(container).toBeInTheDocument();

    setTimeout(() => {
      expect(mockHandleTimesUp).toBeCalled();
    }, 1000);
  });

  it("snapshot matches", () => {
    const mockHandleTimesUp = jest.fn();

    // render component
    const { baseElement } = render(
      <Timer timerHasStarted={false} handleTimesUp={mockHandleTimesUp} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
