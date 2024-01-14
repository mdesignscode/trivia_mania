import { OPTIONS, POST } from "@/app/api/questions/play/route";
import { curryLibrary, saveMockQuestions, setMockUserAttribute } from "@/utils/test_utils_api";
import { ANSWERED_QUESTIONS } from "@/utils/localStorage_utils";
import { IPlayRequest } from "@/models/customRequests";

describe("OPTIONS /questions/play", () => {
  it("Returns the options available for play route", async () => {
    const headers = OPTIONS().headers,
      allowOrigin = headers.get("Access-Control-Allow-Origin"),
      allowMethods = headers.get("Access-Control-Allow-Methods"),
      allowHeader = headers.get("Access-Control-Allow-Headers")

    expect(allowOrigin).toBe("*")
    expect(allowMethods).toBe("POST")
    expect(allowHeader).toBe("Content-Type")
  })
});

describe("POST questions/play", function () {
  const url = "http://localhost:3000/api/questions/play";
  const { requestCreator, getMockResponse } = curryLibrary<IPlayRequest>(POST, url)

  test("Should return an array of filtered questions", async function () {
    const req = requestCreator({ difficulty: "easy", categories: ["General Knowledge"] })
    const data = await getMockResponse(req, "getAllQuestions")

    expect(data.length).toStrictEqual(2);
  });

  test("Should return an array of all questions", async function () {
    // test body
    const req = requestCreator({ difficulty: "", categories: [] })
    const data = await getMockResponse(req, "getAllQuestions")
    expect(data.length).toStrictEqual(4);
  });

  test("Should return a list of questions a user has not answered", async () => {
    setMockUserAttribute(ANSWERED_QUESTIONS, ["1", "2"])
    saveMockQuestions()

    // test body
    const req = requestCreator({ difficulty: "", categories: [], userId: "mockId" })

    // get response
    const data = await getMockResponse(req)

    expect(data.length).toStrictEqual(2);
  })
});
