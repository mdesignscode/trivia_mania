import Start from "@/app/game/components/start";
import { renderGameContext } from "@/utils/test_game_context";
import { screen } from "@/utils/test_utils";

describe("Start component", () => {
  it("Renders a start playing animation", async () => {
    renderGameContext(<Start />, { startPlaying: false });

    const container = await screen.findByTestId("start-container");
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderGameContext(<Start />);
    expect(baseElement).toMatchSnapshot();
  });
});
