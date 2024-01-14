import DesktopNav from "@/components/navigation/desktop";
import { mockGlobalContext } from "@/utils/test_global_context";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";
import {
  HomeIcon,
  PuzzlePieceIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

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

describe("DesktopNav component", () => {
  it("Should render a list of internal navigation buttons", async () => {
    // render component
    const { baseElement } = renderHomeContext(
      <DesktopNav navigation={navigation} path="/" />
    );

    // get container from DOM
    const container = await screen.findByTestId("desktop-nav-container");
    expect(container).toBeInTheDocument();

    // assert all navigation items are rendered
    for (const nav of navigation) {
      const navButton = await screen.findByText(nav.name);
      expect(navButton).toBeInTheDocument();
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
      <DesktopNav navigation={navigation} path="/" />,
      {},
      { triviaUser: null }
    );
    expect(baseElement).toMatchSnapshot();
  });
});
