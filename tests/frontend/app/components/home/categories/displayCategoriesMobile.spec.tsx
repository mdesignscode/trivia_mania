import DisplayCategoriesMobile from "@/components/home/categories/displayCategoriesMobile";
import {
  mockCategoriesStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

describe("DisplayCategoriesMobile component", () => {
  const categoryKeys = Object.keys(mockCategoriesStats).sort(),
    radius = categoryKeys.length / 2,
    firstSet = categoryKeys.slice(0, radius),
    secondSet = categoryKeys.slice(radius);

  it("Renders first set of categories buttons on mobile", async () => {
    const user = userEvent.setup();

    const mockHandler = jest.fn();

    const { baseElement } = renderHomeContext(
      <DisplayCategoriesMobile
        showMore={false}
        handleCategories={mockHandler}
      />
    );

    const container = await screen.findByTestId(
      "display-categories-mobile-container"
    );
    expect(container).toBeInTheDocument();

    // first set of categories button should be displayed
    for (let i = 0; i < firstSet.length; i++) {
      const category = firstSet[i];
      const categoryButton = await screen.findByTestId(category);
      expect(categoryButton).toBeInTheDocument();

      await user.click(categoryButton);
      expect(mockHandler).toBeCalledWith(i, category);
    }

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders second set of categories buttons on mobile", async () => {
    const user = userEvent.setup();

    const mockHandler = jest.fn();

    const { baseElement } = renderHomeContext(
      <DisplayCategoriesMobile showMore={true} handleCategories={mockHandler} />
    );

    const container = await screen.findByTestId(
      "display-categories-mobile-container"
    );
    expect(container).toBeInTheDocument();

    // first half of categories button should be displayed
    for (let i = 0; i < secondSet.length; i++) {
      const category = secondSet[i];
      const categoryButton = await screen.findByTestId(category);
      expect(categoryButton).toBeInTheDocument();

      await user.click(categoryButton);
      expect(mockHandler).toBeCalledWith(i, category);
    }

    expect(baseElement).toMatchSnapshot();
  });
});
