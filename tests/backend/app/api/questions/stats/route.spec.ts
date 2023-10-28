import { POST } from "@/app/api/questions/stats/route";
import { IStatsRequest } from "@/models/customRequests";
import { ANSWERED_QUESTIONS } from "@/utils/localStorage_utils";
import { curryLibrary, saveMockQuestions, setMockUserAttribute } from "@/utils/test_utils_api";

describe("POST questions/stats", function () {
  const url = "http://localhost:3000/api/questions/stats";
  const { requestCreator, errorAsserter, getMockResponse } = curryLibrary<IStatsRequest>(POST, url);

  test("Should return a record of question stats based on a difficulty", async function () {
    const req = requestCreator({ difficulty: "easy" })
    const data = await getMockResponse(req, "questionsStats", () => ({
      easy: 2,
      "General Knowledge": 2,
      "all categories": 2
    }))

    expect(data["all categories"]).toBe(2);
    expect(data["General Knowledge"]).toBe(2);
    expect(data.easy).toBe(2);
  });

  test("Should return a record of question stats unique to a user", async function () {
    const req = requestCreator({ userId: "mockId" })
    saveMockQuestions()
    setMockUserAttribute(ANSWERED_QUESTIONS, ["1", "2"])
    const data = await getMockResponse(req)

    expect(data.easy).toBe(1);
  });

  test("Should throw `Invalid difficulty` if difficulty not `easy`, `hard`, `medium`", async function () {
    errorAsserter({ difficulty: "professional" }, "Invalid difficulty")
  });
});
