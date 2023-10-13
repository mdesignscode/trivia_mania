import Categories from "@/components/home/categories";
import { renderHomeContext } from "@/utils/test_home_context";
import { screen } from "@/utils/test_utils";

describe("Categories component", () => {
  it("should render the `RenderCategories` component", async () => {
    renderHomeContext(<Categories />);
    const container = await screen.findByTestId("render-categories-container");
    expect(container).toBeInTheDocument();
  });

  it("snapshot matches", () => {
  // render component
  const { baseElement } = renderHomeContext(<Categories />);
  expect(baseElement).toMatchSnapshot();
  });
});
