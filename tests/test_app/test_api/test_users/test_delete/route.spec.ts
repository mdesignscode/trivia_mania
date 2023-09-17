import storage from "../../../../../models/index";
import { POST } from "../../../../../app/api/users/delete/route";
import { spy } from "sinon";

describe("POST users/delete", function () {
  // create request
  const url = "http://localhost:3000/api/users/delete";

  test("Should delete a user from storage", async function () {
    // test body
    const body = { id: "test_id" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // spy storage methods
    const spyDeleteUser = spy(storage, "deleteUser");
    const spySave = spy(storage, "save");

    // get response
    const res = await POST(req);
    const {message} = await res.json()

    expect(message).toStrictEqual("User deleted successfully")

    // spy on methods
    const userDeleted = spyDeleteUser.calledWithExactly("test_id");
    const didSave = spySave.calledOnce

    expect(userDeleted).toBeTruthy()
    expect(didSave).toBeTruthy()

    // restore spies
    spyDeleteUser.restore()
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
