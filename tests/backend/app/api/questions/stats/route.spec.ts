import { OPTIONS, POST } from "@/app/api/questions/stats/route";
import { TStatsRequest } from "@/models/customRequests";
import { ANSWERED_QUESTIONS } from "@/utils/localStorage_utils";
import { curryLibrary, saveMockQuestions, setMockUserAttribute } from "@/utils/test_utils_api";

describe("OPTIONS /questions/stats", () => {
  it("Returns the options available for stats route", async () => {
    const headers = OPTIONS().headers,
      allowOrigin = headers.get("Access-Control-Allow-Origin"),
      allowMethods = headers.get("Access-Control-Allow-Methods"),
      allowHeader = headers.get("Access-Control-Allow-Headers")

    expect(allowOrigin).toBe("*")
    expect(allowMethods).toBe("POST")
    expect(allowHeader).toBe("Content-Type")
  })
});

describe("POST questions/stats", function () {
  const url = "http://localhost:3000/api/questions/stats";
  const { requestCreator, getMockResponse } = curryLibrary<TStatsRequest>(POST, url);

  test("Should return a record of question stats based on a difficulty", async function () {
    const req = requestCreator({ recordType: "categories", difficulty: "easy" })
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
    const req = requestCreator({ recordType: "difficulties", userId: "mockId" })
    saveMockQuestions()
    setMockUserAttribute(ANSWERED_QUESTIONS, ["1", "2"])
    const data = await getMockResponse(req)

    expect(data.easy).toBe(1);
  });
});
