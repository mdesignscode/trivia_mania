import MobileNav from "@/components/navigation/mobile";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";
import { navigation } from "./desktop.spec";

describe("MobileNav component", () => {
  it("Should render a list of internal navigation buttons", async () => {
    // setup user
    const user = userEvent.setup();

    // render component
    const { baseElement } = renderHomeContext(
      <MobileNav navigation={navigation} path="/" />
    );

    // get container from DOM
    const container = await screen.findByTestId("mobile-nav-container");
    expect(container).toBeInTheDocument();

    // get disclosure button
    const disclosure = await screen.findByTestId("disclosure-button");
    expect(disclosure).toBeInTheDocument();
    await user.click(disclosure);

    // assert all navigation items are rendered
    for (const nav of navigation) {
      const navButton = await screen.findByTestId(nav.name);
      expect(navButton).toHaveAttribute("href", nav.href);
    }

    const userButton = await screen.findByTestId("user-button");
    expect(userButton).toBeInTheDocument();

    // assert user stats button is rendered
    const userStatsButton = await screen.findByTestId("your-stats-button");
    expect(userStatsButton).toHaveAttribute("href", "/users/mockId");

    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches with user offline", () => {
    // render component
    const { baseElement } = renderHomeContext(
      <MobileNav navigation={navigation} path="/" />,
      {},
      { triviaUser: null }
    );
    expect(baseElement).toMatchSnapshot();
  });
});
