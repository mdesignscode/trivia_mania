import UserProgress from "@/app/users/[id]/page";
import storage from "@/models/index";
import { mockUser } from "@/utils/test_global_context";
import { render, screen } from "@/utils/test_utils";

// Mock the storage module
jest.mock("@/models/index", () => ({
  getTopTenUsers: jest.fn(() => [mockUser]),
  getUser: jest.fn(),
  getUserStats: jest.fn(),
}));

describe("UserProgress component", () => {
  it("should fetch user data from backend", async () => {
    // render component
    render(<UserProgress params={{ id: mockUser.id }} />);

    // assert function calls
    expect(storage.getTopTenUsers).toBeCalled();
    expect(storage.getUser).toBeCalledWith(mockUser.id);
    expect(storage.getUserStats).toBeCalledWith(mockUser.id);
  });

  it("should display user progress if id is valid", async () => {
    // set mock to return a valid user
    (storage.getUser as jest.Mock<any, any, any>).mockReturnValue(mockUser);

    // render component
    render(<UserProgress params={{ id: mockUser.id }} />);

    const container = await screen.findByTestId(
      "display-user-progress-container"
    );
    expect(container).toBeInTheDocument();
  });

  it("should display user not found page if id is invalid", async () => {
    // set mock to return an invalid user
    (storage.getUser as jest.Mock<any, any, any>).mockReturnValue(null);

    // render component
    render(<UserProgress params={{ id: "invalidId" }} />);

    const container = await screen.findByTestId("not-found-container");
    expect(container).toBeInTheDocument();
  });
});
