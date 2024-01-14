import { ReactElement } from "react";
import { renderGlobalContext } from "./test_global_context";
import {
  GameContext,
  IGameContext,
  initialGameContext,
} from "@/context/gameContext";

// setup game context

// create context object
export const mockGameContext = JSON.parse(
  JSON.stringify(initialGameContext)
) as IGameContext;

// spy functions
export const mockSubmitProgress = jest.fn();
export const mockUpdateProgress = jest.fn();
export const mockNextQuestionsSet = jest.fn();
export const mockIncrementIndex = jest.fn();

// setup mock environment
mockGameContext.submitProgress = mockSubmitProgress;
mockGameContext.incrementIndex = mockIncrementIndex;
mockGameContext.nextQuestionsSet = mockNextQuestionsSet;
mockGameContext.updateProgress = mockUpdateProgress;
mockGameContext.startPlaying = true;

// wrap game context inside global context
export const renderGameContext = (
  ui: ReactElement,
  customData: Record<string, any> = {}
) => {
  const value = {
    ...mockGameContext,
    ...customData,
  };

  return renderGlobalContext(
    <GameContext.Provider value={value}>{ui}</GameContext.Provider>
  );
};
