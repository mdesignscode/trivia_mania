import DesktopNav from "@/components/navigation/desktop";
import { navigation } from "@/components/navigation/navigation";
import { mockGlobalContext } from "@/utils/test_global_context";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

describe("DesktopNav component", () => {
  it("Should render a list of internal navigation buttons", async () => {
    // render component
    renderHomeContext(
      <DesktopNav
        navigation={navigation}
        path="/"
        userStatus={mockGlobalContext.userStatus}
      />
    );

    // get container from DOM
    const container = await screen.findByTestId("desktop-nav-container");
    expect(container).toBeInTheDocument();

    // assert all navigation items are rendered
    navigation.forEach(async (nav) => {
      const navButton = await screen.findByDisplayValue(nav.name);
      expect(navButton).toBeInTheDocument()
      expect(navButton).toHaveAttribute("href", nav.href)
    });
  });
});
