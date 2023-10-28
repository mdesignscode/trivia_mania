import Welcome from "@/components/home/welcome";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

describe("Welcome component component", () => {
  it("Renders a welcome UI", async () => {
    renderHomeContext(<Welcome />, {
      currentUI: {
        welcome: true,
        difficulties: false,
        categories: false,
        play: false,
      },
      showCategories: false,
    });

    const container = await screen.findByTestId("welcome-container");
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(<Welcome />, {
      currentUI: {
        welcome: true,
        difficulties: false,
        categories: false,
        play: false,
      },
      showCategories: false,
    });
    expect(baseElement).toMatchSnapshot();
  });
});
