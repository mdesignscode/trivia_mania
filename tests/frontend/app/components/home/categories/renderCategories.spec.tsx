import RenderCategories from "@/components/home/categories/renderCategories";
import {
  mockCategoriesStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

describe("RenderCategories component", () => {
  const mockHandleCategories = jest.fn();

  it("Should render the `RenderCategories` and `DisplayControls` components", async () => {
    // render component
    renderHomeContext(
      <RenderCategories handleCategories={mockHandleCategories} />,
      {
        currentUI: {
          welcome: false,
          difficulties: false,
          categories: true,
          play: false,
        },
        showCategories: true,
      }
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
    // render component
    const { baseElement } = renderHomeContext(
      <RenderCategories handleCategories={mockHandleCategories} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
