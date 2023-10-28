import MobileNav from "@/components/navigation/mobile";
import { mockGlobalContext } from "@/utils/test_global_context";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";
import { navigation } from "./desktop.spec";

jest.mock("@clerk/nextjs");

describe("MobileNav component", () => {
  it("Should render a list of internal navigation buttons", async () => {
    // setup user
    const user = userEvent.setup();

    // render component
    renderHomeContext(
      <MobileNav
        navigation={navigation}
        path="/"
        userStatus={mockGlobalContext.userStatus}
      />
    );

    // get container from DOM
    const container = await screen.findByTestId("mobile-nav-container");
    expect(container).toBeInTheDocument();

    // get disclosure button
    const disclosure = await screen.findByTestId("disclosure-button");
    expect(disclosure).toBeInTheDocument();
    await user.click(disclosure);

    // assert all navigation items are rendered
    navigation.forEach(async (nav) => {
      const navButton = await screen.findByDisplayValue(nav.name);
      expect(navButton).toBeInTheDocument();
      expect(navButton).toHaveAttribute("href", nav.href);
    });
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(
      <MobileNav
        navigation={navigation}
        path="/"
        userStatus={mockGlobalContext.userStatus}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
