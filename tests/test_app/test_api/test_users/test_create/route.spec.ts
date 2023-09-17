import storage from "../../../../../models/index";
import { POST } from "../../../../../app/api/users/create/route";
import { spy } from "sinon";
import User from "../../../../../models/user";

describe("POST users/create", function () {
  // create request
  const url = "http://localhost:3000/api/users/create";

  test("Should add a user to storage", async function () {
    // test body
    const body = { username: "test_user", id: "test_id" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // spy storage methods
    const spyNewUser = spy(storage, "newUser");
    const spySave = spy(storage, "save");

    // get response
    const res = await POST(req);
    const {message} = await res.json()

    expect(message).toStrictEqual("User created successfully")

    // spy on methods
    const testUser = new User("test_user", "test_id")
    const userAdded = spyNewUser.calledWithExactly(testUser);
    const didSave = spySave.calledOnce

    expect(userAdded).toBeTruthy()
    expect(didSave).toBeTruthy()

    // restore spies
    spyNewUser.restore()
    spySave.restore()
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

  test("Should return `Username required` if no username provided", async function () {
    // test body
    const body = {};
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("Username required");
  });
});
