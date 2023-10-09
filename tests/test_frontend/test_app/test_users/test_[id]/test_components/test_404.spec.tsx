import NotFound from "@/app/users/[id]/components/404";
import { screen, render } from "@/utils/test_utils"

describe("NotFound component", () => {
  it("Should render a user not found page", async () => {
    render(<NotFound id="invalidUserId" />)

    const container = await screen.findByTestId("not-found-container");
    expect(container).toBeInTheDocument();

    const text = await screen.findAllByRole("heading")

    expect(text[0]).toHaveTextContent("User with id")
    expect(text[1]).toHaveTextContent("invalidUserId")
    expect(text[2]).toHaveTextContent("not found")

    const image = await screen.findByRole("img")
    expect(image).toBeInTheDocument()
  })
});
