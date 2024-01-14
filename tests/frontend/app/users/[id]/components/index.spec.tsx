import DisplayUserProgress from "@/app/users/[id]/components";
import { mockInitialProgress } from "@/utils/mockData";
import {
  mockUser,
  renderGlobalContext,
} from "@/utils/test_global_context";
import { screen } from "@/utils/test_utils";

describe("DisplayUserProgress component", () => {
  it("Should display user progress if available", async () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([mockUser]);

    // render component
    renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={mockInitialProgress}
      />
    );

    const text = await screen.findByText("Your overall stats");
    expect(text).toBeInTheDocument();
  });

  it("Should display user last results if available", async () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([mockUser]);

    // set last results in local storage
    localStorage.setItem("progress", JSON.stringify(mockInitialProgress));

    // render component
    renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={mockInitialProgress}
      />
    );

    const text = await screen.findByText("Your last played results");
    expect(text).toBeInTheDocument();
  });

  it("Should indicate user has not played no stats if available", async () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([]);

    // render component
    renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={{
          total: {
            answered: 0,
            correctAnswered: 0,
          },
        }}
      />
    );

    const text = await screen.findByTestId("no-stats-available");
    expect(text).toBeInTheDocument();
  });

  it("snapshot matches user's progress", () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([mockUser]);

    // render component
    const { baseElement } = renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={mockInitialProgress}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches last results", () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([mockUser]);

    // set last results in local storage
    localStorage.setItem("progress", JSON.stringify(mockInitialProgress));

    // render component
    const { baseElement } = renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={mockInitialProgress}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("snapshot matches no user stats", () => {
    // mock props
    const serializedUser = JSON.stringify(mockUser);
    const serializedTopTen = JSON.stringify([]);

    // render component
    const { baseElement } = renderGlobalContext(
      <DisplayUserProgress
        serializedTopTen={serializedTopTen}
        serializedUser={serializedUser}
        userStats={{
          total: {
            answered: 0,
            correctAnswered: 0,
          },
        }}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
