import storage from "../../../../../models/index";
import User from "../../../../../models/user";
import { POST } from "../../../../../app/api/users/get/route";
import { stub } from "sinon";
import { IUser } from "../../../../../models/interfaces";

describe("POST users/get", function () {
  // create request
  const url = "http://localhost:3000/api/users/get";

  test("Should retrieve a user from storage", async function () {
    // test body
    const body = { id: "test_id" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // create test user
    const testUser = new User("test_user", "test_id")

    // stub storage methods
    const stubGetUser = stub(storage, "getUser");
    stubGetUser.callsFake(() => testUser)

    // get response
    const res = await POST(req);
    const data = await res.json() as IUser

    expect(data.username).toStrictEqual("test_user")
    expect(data.id).toStrictEqual("test_id")

    // restore stub
    stubGetUser.restore()
  });

  test("Should return `Invalid body` if body cannot be read as json", async function () {
    // test body
    const body = undefined;
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("Invalid body");
  });

  test("Should return `User id required` if no id provided", async function () {
    // test body
    const body = {};
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("User id required");
  });
});
