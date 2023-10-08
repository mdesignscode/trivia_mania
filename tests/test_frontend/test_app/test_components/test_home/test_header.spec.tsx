import Header from "@/components/home/header";
import { screen, render } from "@/utils/test_utils"

describe("Header component", () => {
  it("should display header text", async () => {
    render(<Header />)

    const container = await screen.findByTestId("header-container")

    expect(container).toBeInTheDocument()
  })
});
