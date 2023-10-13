import DisplayControls from "@/components/home/categories/displayControls";
import {
  mockCategoriesStats,
  mockSetCategories,
  renderHomeContext,
} from "@/utils/test_home_context";
import { screen, userEvent } from "@/utils/test_utils";

describe("DisplayControls component", () => {
  it("Displays `Show more categories` and `Reset categories` buttons", async () => {
    // create mock props
    const mockSetShowMore = jest.fn();
    const mockSetCategoryChoice = jest.fn();

    // render component
    renderHomeContext(
      <DisplayControls
        showMore={false}
        setShowMore={mockSetShowMore}
        setCategoryChoice={mockSetCategoryChoice}
      />
    );

    // get elements from DOM
    const container = await screen.findByTestId("display-controls-container"),
      showMoreButton = await screen.findByTestId("show-more-button"),
      resetCategoriesButton = await screen.findByTestId(
        "reset-categories-button"
      );

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(showMoreButton).toBeInTheDocument();
    expect(resetCategoriesButton).toBeInTheDocument();
  });

  it("show-more-button should negate showMore state", async () => {
    // create mock props
    const mockSetShowMore = jest.fn();
    const mockSetCategoryChoice = jest.fn();

    // setup user interaction
    const user = userEvent.setup();

    // render component
    renderHomeContext(
      <DisplayControls
        showMore={false}
        setShowMore={mockSetShowMore}
        setCategoryChoice={mockSetCategoryChoice}
      />
    );

    // get button from DOM
    const showMoreButton = await screen.findByTestId("show-more-button");

    // click on button
    await user.click(showMoreButton);

    // will show more category stats now
    expect(mockSetShowMore).toBeCalled();

    await user.click(showMoreButton);
    // will show less category stats now
    expect(mockSetShowMore).toBeCalled();
  });

  it("reset-categories-button should clear categories filters", async () => {
    // create mock props
    const mockSetShowMore = jest.fn();
    const mockSetCategoryChoice = jest.fn();

    // setup user interaction
    const user = userEvent.setup();

    // render component
    renderHomeContext(
      <DisplayControls
        showMore={false}
        setShowMore={mockSetShowMore}
        setCategoryChoice={mockSetCategoryChoice}
      />
    );

    // get button from DOM
    const resetCategoriesButton = await screen.findByTestId(
      "reset-categories-button"
    );

    // click on button
    await user.click(resetCategoriesButton);

    // filters should be cleared
    expect(mockSetCategoryChoice).toBeCalled();
    expect(mockSetCategories).toBeCalledWith([]);
  });

  it("snapshot matches", () => {
    // create mock props
    const mockSetShowMore = jest.fn();
    const mockSetCategoryChoice = jest.fn();

    // render component
    const { baseElement } = renderHomeContext(
      <DisplayControls
        showMore={false}
        setShowMore={mockSetShowMore}
        setCategoryChoice={mockSetCategoryChoice}
      />
    );

    expect(baseElement).toMatchSnapshot()
  })
});
