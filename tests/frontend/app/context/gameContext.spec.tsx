import { GameContext, GameProvider } from "@/app/context/gameContext";
import { GlobalProvider } from "@/app/context/globalContext";
import { initialStat } from "@/models/interfaces";
import {
  ANSWERED_QUESTIONS,
  PROGRESS,
  UNSAVED_DATA,
} from "@/utils/localStorage_utils";
import { mockInitialProgress, mockQuestion } from "@/utils/mockData";
import { act, renderHook } from "@/utils/test_utils";
import { renderProvider } from "@/utils/test_utils_contextProviders";
import axios from "axios";
import { useContext } from "react";

jest.mock("@tanstack/react-query");

describe("GameContext provider", () => {
  const mockStats = {
    total: { answered: 1, correctAnswered: 0 },
    easy: { answered: 1, correctAnswered: 0 },
    "Mock Category": { easy: { answered: 1, correctAnswered: 0 } },
  };

  const Wrapper = ({ children }: { children: React.ReactElement }) => {
    return (
      <GlobalProvider>
        <GameProvider>{children}</GameProvider>
      </GlobalProvider>
    );
  };

  it("Deserializes previous progress into state", async () => {
    const renderer = renderProvider("game");
    // store progress in local storage
    localStorage.setItem(PROGRESS, JSON.stringify(mockInitialProgress));
    localStorage.setItem(ANSWERED_QUESTIONS, "Mock answer");

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

  it("Updates a user's progress and adds it to local storage", async () => {
    // render hook to get `updateProgress`
    const state = renderHook(() => useContext(GameContext), {
      wrapper: Wrapper,
    });

    // assert initial progress
    const initialPlayerStats = state.result.current.playerStats;
    expect(initialPlayerStats).toEqual(initialStat);

    // update progress
    act(() => state.result.current.updateProgress(mockQuestion, ""));

    // assert new progress
    const newPlayerStats = state.result.current.playerStats;
    expect(newPlayerStats).toEqual(mockStats);
    expect(state.result.current.answeredQuestions.join(",")).toBe("mockId");
  });

  it("Submits a user's progress to server", async () => {
    // render hook to get `submitProgress`
    const state = renderHook(() => useContext(GameContext), {
      wrapper: Wrapper,
    });

    // update progress and submit
    act(() => {
      state.result.current.updateProgress(mockQuestion, "");
      state.result.current.submitProgress();
    });

    // assert api call was made with correct data
    expect(axios.post).toBeCalledWith("mockhost/apiusers/updateStats", {
      stats: mockStats,
      id: "mockId",
      answeredQuestions: ["mockId"],
    });
  });
});
