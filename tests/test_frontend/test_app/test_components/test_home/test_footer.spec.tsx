import Footer from "@/components/home/footer";
import { screen, render } from "@/utils/test_utils"

describe("Footer component", () => {
  it("should display footer text", async () => {
    render(<Footer />)

    const container = await screen.findByTestId("footer-container")

    expect(container).toBeInTheDocument()
  })
});
