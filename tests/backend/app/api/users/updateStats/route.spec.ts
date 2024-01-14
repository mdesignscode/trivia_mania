import storage from "@/models/index";
import { OPTIONS, POST } from "@/app/api/users/updateStats/route";
import { spy } from "sinon";
import { IUpdateUserStatsRequest } from "@/models/customRequests";
import { curryLibrary } from "@/utils/test_utils_api";
import { mockInitialProgress } from "@/utils/mockData";

describe("OPTIONS /users/updateStats", () => {
  it("Returns the options available for updateStats route", async () => {
    const headers = OPTIONS().headers,
      allowOrigin = headers.get("Access-Control-Allow-Origin"),
      allowMethods = headers.get("Access-Control-Allow-Methods"),
      allowHeader = headers.get("Access-Control-Allow-Headers")

    expect(allowOrigin).toBe("*")
    expect(allowMethods).toBe("POST")
    expect(allowHeader).toBe("Content-Type")
  })
});

describe("POST users/updateStats", function () {
  const url = "http://localhost:3000/api/users/updateStats";
  const { getMockResponse, requestCreator } = curryLibrary<IUpdateUserStatsRequest>(POST, url);

  test("Should update a user's progress", async function () {
    // create storage.updateUserProgress spy
    const spyUpdateUserProgress = spy(storage, "updateUserProgress");

    const mockAnsweredQuestions = ["Mock Question Id"]
    const req = requestCreator({ id: "mockId", stats: mockInitialProgress, answeredQuestions: mockAnsweredQuestions })

    const data = await getMockResponse(req)

    expect(data).toBe("User stats updated successfully");

    // spy on method
    const progressUpdated = spyUpdateUserProgress.calledWithExactly(
      "mockId",
      mockInitialProgress,
      mockAnsweredQuestions
    );

    expect(progressUpdated).toBeTruthy();

    // restore spy and stub
    spyUpdateUserProgress.restore();
  });
});
