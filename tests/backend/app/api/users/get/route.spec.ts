import { OPTIONS, POST } from "@/api/users/get/route";
import { IGetUserRequest } from "@/models/customRequests";
import User from "@/models/user";
import { curryLibrary } from "@/utils/test_utils_api";

describe("POST /users/get", () => {
  const url = "http://localhost:3000/api/users/get";
  const { getMockResponse, requestCreator } = curryLibrary<IGetUserRequest>(POST, url);
  it("Returns a user in storage", async () => {
    const req = requestCreator({ id: "mockId" })
    const data: User = await getMockResponse(req)

    expect(data.username).toBe("mock user")
  })
});

describe("OPTIONS /users/get", () => {
  it("Returns the options available for get route", async () => {
    const headers = OPTIONS().headers,
      allowOrigin = headers.get("Access-Control-Allow-Origin"),
      allowMethods = headers.get("Access-Control-Allow-Methods"),
      allowHeader = headers.get("Access-Control-Allow-Headers")

    expect(allowOrigin).toBe("*")
    expect(allowMethods).toBe("POST")
    expect(allowHeader).toBe("Content-Type")
  })
});
