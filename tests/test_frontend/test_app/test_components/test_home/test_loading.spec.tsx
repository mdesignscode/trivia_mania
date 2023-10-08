import Loading from "@/components/home/loading";
import { render } from "@/utils/test_utils";

describe("Loading component", () => {
  it("should render loading skeletons with specified dimensions", () => {
    const { getAllByTestId } = render(<Loading length={3} width={80} />);

    // Check if the expected number of skeletons is rendered
    const skeletons = getAllByTestId("loading-skeleton");
    expect(skeletons).toHaveLength(3);

    // Check if each skeleton has the specified width
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveStyle("width: 80px");
    });
  });
});
