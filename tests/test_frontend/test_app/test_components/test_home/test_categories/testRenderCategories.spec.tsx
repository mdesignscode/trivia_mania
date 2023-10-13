import RenderCategories from "@/components/home/categories/renderCategories";
import {
  mockCategoriesStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

describe("RenderCategories component", () => {
  it("Should render the `RenderCategories` and `DisplayControls` components", async () => {
    // create mock props
    const mockHandleCategories = jest.fn(),
      mockSetCategoryChoice = jest.fn();

    // render component
    renderHomeContext(
      <RenderCategories
        handleCategories={mockHandleCategories}
        setCategoryChoice={mockSetCategoryChoice}
        categoryChoice={Object.keys(mockCategoriesStats).map(() => false)}
      />
    );

    // get elements from DOM
    const renderContainer = await screen.findByTestId(
        "render-categories-container"
      ),
      constrolsContainer = await screen.findByTestId(
        "display-controls-container"
      ),
      dipayContainer = await screen.findByTestId(
        "display-categories-container"
      ),
      text = await screen.findByText("Choose categories");

    // assert elements are in the DOM
    expect(renderContainer).toBeInTheDocument();
    expect(constrolsContainer).toBeInTheDocument();
    expect(dipayContainer).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("snapshot matches", () => {
    // create mock props
    const mockHandleCategories = jest.fn(),
      mockSetCategoryChoice = jest.fn();

    // render component
    const { baseElement } = renderHomeContext(
      <RenderCategories
        handleCategories={mockHandleCategories}
        setCategoryChoice={mockSetCategoryChoice}
        categoryChoice={Object.keys(mockCategoriesStats).map(() => false)}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
