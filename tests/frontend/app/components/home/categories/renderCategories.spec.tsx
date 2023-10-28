import RenderCategories from "@/components/home/categories/renderCategories";
import {
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";
import { isMobileRef } from "setupTests_frontend";

describe("RenderCategories component", () => {
  const mockHandleCategories = jest.fn();

  it("Should render the `DisplayCategories` and `DisplayControls` components", async () => {
    // render component
    const { baseElement } = renderHomeContext(
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
    expect(baseElement).toMatchSnapshot();
  });

  it("Should render the `DisplayCategoriesMobile` and `DisplayControls` components", async () => {
    isMobileRef.current = true;

    // render component
    const { baseElement } = renderHomeContext(
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
        "display-categories-mobile-container"
      ),
      text = await screen.findByText("Choose categories");

    // assert elements are in the DOM
    expect(renderContainer).toBeInTheDocument();
    expect(constrolsContainer).toBeInTheDocument();
    expect(dipayContainer).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    isMobileRef.current = false;
  });
});
