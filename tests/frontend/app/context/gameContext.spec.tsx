import { GameContext, GameProvider } from "@/app/context/gameContext";
import { GlobalContext, GlobalProvider } from "@/app/context/globalContext";
import { CategoryStat, initialStat } from "@/models/interfaces";
import { ANSWERED_QUESTIONS, PROGRESS } from "@/utils/localStorage_utils";
import { mockInitialProgress, mockQuestion } from "@/utils/mockData";
import { mockUser } from "@/utils/test_global_context";
import { render } from "@/utils/test_utils";
import { renderProvider } from "@/utils/test_utils_contextProviders";
import { useContext, useEffect, useState } from "react";

jest.useFakeTimers();

jest.mock("@tanstack/react-query");

describe("GameContext provider", () => {
  const renderer = renderProvider("game");
  it("Deserializes previous progress into state", async () => {
    // store progress in local storage
    localStorage.setItem(PROGRESS, JSON.stringify(mockInitialProgress));
    localStorage.setItem(ANSWERED_QUESTIONS, ["Mock answer"].join(","));

    const { getByTestId } = renderer((value) => {
      return (
        <div>
          <p data-testid="progress-count">
            total: {value.playerStats.total.answered}
          </p>
        </div>
      );
    });

    const progressCount = getByTestId("progress-count");
    expect(progressCount).toHaveTextContent("total: 1");
  });

  it("Updates and submits a user's progress", () => {
    // create a component to test event handlers
    function TestProgressHandlers() {
      const [render, setRender] = useState(false);

      const {
        userStatus: { user },
      } = useContext(GlobalContext);
      const { updateProgress, submitProgress, playerStats } =
        useContext(GameContext);

      useEffect(() => {
        // give global provider some time to process localStorage
        jest.advanceTimersByTime(1500);
        setTimeout(() => {
          // fire progress update and submit
          updateProgress(mockQuestion, "");
          submitProgress();
          setRender(true);
        }, 1500);
      }, [submitProgress, updateProgress]);

      // render data to assert
      return (
        render && (
          <div>
            <p data-testid="easy-count">
              {playerStats.easy?.answered as number}
            </p>
            <p data-testid="category-count">
              {
                (playerStats["Mock Category"] as CategoryStat)?.easy
                  ?.answered as number
              }
            </p>

            <p data-testid="user-progress">{user?.stats.total.answered}</p>
            <p data-testid="answered-questions">{user?.answeredQuestions}</p>
          </div>
        )
      );
    }

    // <TestProgressHandlers />
    const { getByTestId } = render(
      <GlobalProvider>
        <GameProvider>
          <TestProgressHandlers />
        </GameProvider>
      </GlobalProvider>
    );

    const easyCount = getByTestId("easy-count"),
      categoryCount = getByTestId("category-count"),
      progressCount = getByTestId("user-progress"),
      answerdedQuestions = getByTestId("answered-questions");

    // assert handlers behaviour
    expect(easyCount).toHaveTextContent("1");
    expect(categoryCount).toHaveTextContent("1");
    expect(progressCount).toHaveTextContent("1");
    expect(answerdedQuestions).toHaveTextContent("Mock Answer");

    mockUser.stats = initialStat;
    mockUser.answeredQuestions = [];
  });
});
