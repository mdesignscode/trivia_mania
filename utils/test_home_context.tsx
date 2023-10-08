import {
  HomeContext,
  IHomeContext,
  defaultHomeContext,
} from "@/components/home/store";
import { ReactElement } from "react";
import { renderGlobalContext } from "./test_global_context";

// setup home context

// create mock category stats
const mockList = Array.from({ length: 20 }, (_, i) => i + 1);
export const mockCategoriesStats: Record<string, number> = {};
mockList.forEach((item) => {
  mockCategoriesStats[`Category ${item}`] = Math.floor(Math.random() * 100);
});

// create context object
export const mockHomeContext = JSON.parse(
  JSON.stringify(defaultHomeContext)
) as IHomeContext;

// spy functions
export const mockSetCategories = jest.fn();
export const mockGetQuestionStats = jest.fn();
export const mockSetDifficulty = jest.fn();
export const mockSetFetchingCategories = jest.fn();

// setup mock environment
mockHomeContext.categoryStats = mockCategoriesStats;
mockHomeContext.fetchingCategories = false;
mockHomeContext.setCategories = mockSetCategories;
mockHomeContext.difficulty = "";
mockHomeContext.setDifficulty = mockSetDifficulty;
mockHomeContext.getQuestionStats = mockGetQuestionStats;
mockHomeContext.setFetchingCategories = mockSetFetchingCategories;

// wrap home context inside global context
export const renderHomeContext = (
  ui: ReactElement,
  customData: Record<string, any> = {}
) => {
  const value = {
    ...mockHomeContext,
    ...customData
  }

  return renderGlobalContext(
    <HomeContext.Provider value={value}>{ui}</HomeContext.Provider>
  );
};
