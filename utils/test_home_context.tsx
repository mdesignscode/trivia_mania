import {
  HomeContext,
  IHomeContext,
  defaultHomeContext,
} from "@/context/homeContext";
import { ReactElement } from "react";
import { renderGlobalContext } from "./test_global_context";

// setup home context

const randomNumber = () => Math.floor(Math.random() * (300 - 20 + 1)) + 20;

// create mock category stats
const mockList = Array.from({ length: 20 }, (_, i) => i + 1);
export const mockCategoriesStats: Record<string, TQuestionStats> = {};
mockList.forEach((item, i) => {
  mockCategoriesStats[`Category ${item}`] = {
    easy: randomNumber(),
    medium: randomNumber(),
    hard: randomNumber(),
  };
});

// create context object
export const mockHomeContext = JSON.parse(
  JSON.stringify(defaultHomeContext)
) as IHomeContext;

// spy functions
export const mockGetQuestionStats = jest.fn();
export const mockSetFetchingCategories = jest.fn();
export const mockSetCurrentUI = jest.fn();

// setup mock environment
mockHomeContext.categoryStats = mockCategoriesStats;
mockHomeContext.currentUI = {
  welcome: true,
  difficulties: false,
  categories: false,
  play: false,
};
mockHomeContext.setCurrentUI = mockSetCurrentUI;

// wrap home context inside global context
export const renderHomeContext = (
  ui: ReactElement,
  customData: Record<string, any> = {},
  parentData: Record<string, any> = {}
) => {
  const value = {
    ...mockHomeContext,
    ...customData,
  };

  return renderGlobalContext(
    <HomeContext.Provider value={value}>{ui}</HomeContext.Provider>,
    parentData
  );
};
