import Header from "@/app/users/[id]/components/header";
import { mockUser } from "@/utils/test_global_context";
import { screen, render } from "@/utils/test_utils"

describe("Header component", () => {
  it("Should render the user's avatar and username", async () => {
    // render component
    render(<Header user={mockUser} />)

    // get elements from DOM
    const container = await screen.findByTestId("user-header-container"),
      avatar = await screen.findByRole("img"),
      text = await screen.findByText(mockUser.username)

    // assert elements are in DOM
    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(avatar).toBeInTheDocument()
  })
});
