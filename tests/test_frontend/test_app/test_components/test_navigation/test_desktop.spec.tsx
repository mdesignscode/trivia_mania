import DesktopNav from "@/components/navigation/desktop";
import { mockGlobalContext } from "@/utils/test_global_context";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";
import { HomeIcon, PuzzlePieceIcon, StarIcon } from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Home", href: "/", icon: <HomeIcon height={25} width={25} /> },
  {
    name: "Play",
    href: "/game",
    icon: <PuzzlePieceIcon height={25} width={25} />,
  },
  {
    name: "Score Board",
    href: "/scoreboard",
    icon: <StarIcon height={25} width={25} />,
  },
];

jest.mock("@clerk/nextjs");

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
      expect(navButton).toBeInTheDocument();
      expect(navButton).toHaveAttribute("href", nav.href);
    });
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(
      <DesktopNav
        navigation={navigation}
        path="/"
        userStatus={mockGlobalContext.userStatus}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
