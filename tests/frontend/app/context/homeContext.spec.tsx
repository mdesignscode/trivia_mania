import { mockCategoryStats } from "@/utils/mockData";
import { renderProvider } from "@/utils/test_utils_contextProviders";
import _ from "lodash";

// mock useInitialStats hook
jest.mock("@/hooks/initialStats", () => () => ({
  categoryStats: mockCategoryStats,
  categoriesLoading: false,
}));

describe("HomeContext provider", () => {
  const renderer = renderProvider("home");

  it("Fetches categories stats based", async () => {
    const { getByTestId } = renderer((value) => (
      <div>
        {Object.keys(value.categoryStats).map((category) => {
          return (
            <p key={_.uniqueId()} data-testid={category}>
              {category}
            </p>
          );
        })}
      </div>
    ));

    for (const category in mockCategoryStats) {
      const categoryText = getByTestId(category);
      expect(categoryText).toBeInTheDocument();
    }
  });
});
