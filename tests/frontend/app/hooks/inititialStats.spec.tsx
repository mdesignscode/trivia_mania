import useInitialStats from "@/hooks/initialStats";
import { CATEGORIES, DIFFICULTY } from "@/utils/localStorage_utils";
import { mockCategoryStats, mockDifficultyStats } from "@/utils/mockData";
import { GlobalWrapper, mockSetCategoryChoice } from "@/utils/test_global_context";
import { renderHook } from "@/utils/test_utils";

describe("useInitialStats hook", () => {
  it("Returns questions stats", async () => {
    const categories = ["Entertainment: Film", "Entertainment: Music"];

    localStorage.setItem(DIFFICULTY, "easy");
    localStorage.setItem(CATEGORIES, categories.join(","));

    // expected categoriesChoice list
    const mockCategoriesChoice = Object.keys(mockCategoryStats)
      .sort()
      .map((item) => categories.includes(item));

    const {
      result: {
        current: { difficultyStats, categoryStats },
      },
    } = renderHook(() => useInitialStats(), {
      wrapper: GlobalWrapper(),
    });

    expect(categoryStats).toBe(mockCategoryStats);
    expect(difficultyStats).toBe(mockDifficultyStats);

    expect(mockSetCategoryChoice).toBeCalledWith(mockCategoriesChoice)
  });
});
