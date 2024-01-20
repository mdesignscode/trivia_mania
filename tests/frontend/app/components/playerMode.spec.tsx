import PlayerMode from "@/components/playerMode";
import {
  mockSetPageReady,
  mockSetPlayerMode,
  renderGlobalContext,
} from "@/utils/test_global_context";
import { screen, userEvent } from "@/utils/test_utils";
import { mockRouterPush } from "setupTests_frontend";

describe("PlayerMode component", () => {
  it("Prompts a signed in user to continue", async () => {
    const user = userEvent.setup();
    const { baseElement } = renderGlobalContext(
      <PlayerMode shouldRender={true} />
    );

    const container = await screen.findByTestId("player-mode-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Play asContinue as mock user");

    // find continue button to test behavior
    const continueButton = await screen.findByTestId("continue-button");
    await user.click(continueButton);

    // test behavior
    expect(mockSetPlayerMode).toBeCalledWith("Signed In");
    expect(mockSetPageReady).toBeCalledWith(true);

    expect(baseElement).toMatchSnapshot();
  });

  it("Prompts a signed out user to choose a playing mode", async () => {
    const user = userEvent.setup();

    const { baseElement } = renderGlobalContext(
      <PlayerMode shouldRender={true} />,
      { triviaUser: null }
    );

    const container = await screen.findByTestId("player-mode-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Play asGuest UserSign In");

    // find sign in button to test behavior
    const signInButton = await screen.findByTestId("signin-button");
    await user.click(signInButton);

    // test behavior
    expect(mockRouterPush).toBeCalledWith("/sign-in");
    expect(mockSetPlayerMode).toBeCalledWith("Signed In");
    expect(mockSetPageReady).toBeCalledWith(true);

    // find guest user button to test behavior
    const guestUserButton = await screen.findByTestId("guest-user-button");
    await user.click(guestUserButton);

    // test behavior
    expect(mockSetPageReady).toBeCalledWith(true);

    expect(baseElement).toMatchSnapshot();
  });
});
