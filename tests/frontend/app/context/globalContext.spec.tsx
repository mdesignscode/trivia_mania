import { isOnlineUser } from "@/app/__mocks__/@clerk/nextjs";
import storageAvailable from "@/components/localStorageDetection";
import { CATEGORIES, DIFFICULTY, USERNAME } from "@/utils/localStorage_utils";
import { Matcher, MatcherOptions } from "@/utils/test_utils";
import { renderProvider } from "@/utils/test_utils_contextProviders";
import _ from "lodash";

jest.mock("@tanstack/react-query");

jest.mock("@/components/localStorageDetection");

describe("GlobalContext provider", () => {
  const renderer = renderProvider("global");
  describe("Local storage available", () => {
    it("Loads previous filters from local storage and fetches user from API", () => {
      // set storage is available

      mockStorageState(true);

      // add data to local storage to be processed by provider
      const mockCategories = "Mock Category 1, Mock Category 2";
      localStorage.setItem(CATEGORIES, mockCategories);
      localStorage.setItem(DIFFICULTY, "easy");
      localStorage.setItem(USERNAME, "mock user");

      const { getByTestId } = renderer((value) => (
        <div>
          <p data-testid="user-status">
            {value.triviaUser?.id} {value.triviaUser?.username}{" "}
          </p>
          <p data-testid="difficulty">{value.playFilters.difficulty}</p>
          <p data-testid="categories">{value.playFilters.categories}</p>

          {Object.keys(value.difficultyChoice).map((diff) => {
            return (
              <p
                data-testid={diff}
                key={_.uniqueId()}
              >{`${diff} ${value.difficultyChoice[diff]}`}</p>
            );
          })}
        </div>
      ));

      // Perform assertions to test the provided context values
      const difficulty = getByTestId("difficulty"),
        categories = getByTestId("categories");

      assertUserStatus(getByTestId);
      expect(difficulty).toHaveTextContent("easy");
      expect(categories).toHaveTextContent(mockCategories);

      for (const difficulty of ["hard", "medium", "all difficulties"]) {
        const text = getByTestId(difficulty);
        expect(text).toHaveTextContent(`${difficulty} false`);
      }

      // previous difficulty should be highlighted
      const text = getByTestId("easy");
      expect(text).toHaveTextContent("easy true");
    });

    it("Clears local storage if current user is different from previous user", () => {
      // set storage is available
      mockStorageState(true);

      // add data to local storage to be processed by provider
      localStorage.setItem(DIFFICULTY, "easy");
      localStorage.setItem(USERNAME, "previous mock user");

      renderer(() => <></>);

      const username = localStorage.getItem(USERNAME),
        easy = localStorage.getItem(DIFFICULTY);

      expect(username).toBe("mock user");
      expect(easy).toBeNull();
    });
    it("Sets offline user", () => testOfflineUser(true));
  });

  describe("Local storage not available", () => {
    it("Sets online user", () => {
      // set storage is unavailable
      mockStorageState(false);

      const { getByTestId } = renderer((value) => (
        <div>
          <p data-testid="user-status">
            {value.triviaUser?.id} {value.triviaUser?.username}{" "}
          </p>
        </div>
      ));

      // Perform assertions to test the provided context values
      assertUserStatus(getByTestId);
    });

    it("Sets offline user", () => testOfflineUser(false));
  });

  function testOfflineUser(storageState: boolean) {
    // set storage state and offline user
    mockStorageState(storageState);
    isOnlineUser.current = false

    const { getByTestId } = renderer((value) => {
      return (
        <div>
          <p data-testid="user-status">{`${!!value.triviaUser}`}</p>
        </div>
      );
    });

    const userStatus = getByTestId("user-status");

    expect(userStatus).toHaveTextContent("false");

    isOnlineUser.current = true
  }

  function assertUserStatus(
    getByTestId: (
      id: Matcher,
      options?: MatcherOptions | undefined
    ) => HTMLElement
  ) {
    const userStatus = getByTestId("user-status");
    expect(userStatus).toHaveTextContent(`mockId mock user`);
  }
});

function mockStorageState(state: boolean) {
  (storageAvailable as jest.Mock<any, any, any>).mockReturnValue(() => state);
}
