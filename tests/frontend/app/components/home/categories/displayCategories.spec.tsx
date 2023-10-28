import DisplayCategories from "@/components/home/categories/displayCategories";
import {
  mockCategoriesStats,
  renderHomeContext,
} from "@/utils/test_home_context";
import { userEvent, screen } from "@/utils/test_utils";

describe("DisplayCategories component", () => {
  const mockHandler = jest.fn();

  it("should render a list of categories", async () => {
    const user = userEvent.setup();

    // render component
    renderHomeContext(
      <DisplayCategories
        handleCategories={mockHandler}
        showMore={true}
      />
    );

    // get containers from DOM
    const container = await screen.findByTestId("display-categories-container"),
      firstSet = await screen.findByTestId("first-categories-set"),
      secondSet = await screen.findByTestId("second-categories-set");

    // assert containers are in the DOM
    expect(container).toBeInTheDocument();
    expect(firstSet).toBeInTheDocument();
    expect(secondSet).toBeInTheDocument();

    // component renders a list of category buttons
    Object.keys(mockCategoriesStats).forEach(async (stat, i) => {
      const buttonValue = `${stat} (${mockCategoriesStats[stat]})`;

      // get button
      const Button = await screen.findByText(buttonValue);

      expect(Button).toBeInTheDocument();

      await user.click(Button);

      expect(mockHandler).toBeCalledWith(i, stat);
    });
  });

  it("snapshot matches", () => {
    // render component
    const { baseElement } = renderHomeContext(
      <DisplayCategories
        handleCategories={mockHandler}
        showMore={true}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
