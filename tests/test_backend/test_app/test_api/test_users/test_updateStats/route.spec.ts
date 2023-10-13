import storage from "@/models/index";
import { POST } from "@/app/api/users/updateStats/route";
import { spy, stub } from "sinon";
import User from "@/models/user";
import { IUserStats } from "@/models/interfaces";

describe("POST users/updateStats", function () {
  const url = "http://localhost:3000/api/users/create";

  test("Should update a user's progress", async function () {
    // test body
    const testStat: IUserStats = {
      easy: {
        answered: 15,
        correctAnswered: 10,
      },
      total: {
        answered: 0,
        correctAnswered: 0
      }
    };
    const body = { id: "test_id", stats: testStat, answeredQuestions: ["1", "2"] };

    // create test user
    const testUser = new User("test_user", "test_id")

    // stub storage methods
    const stubGetUser = stub(storage, "getUser");
    stubGetUser.callsFake(() => testUser)

    // create request
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // create storage.updateUserProgress spy
    const spyUpdateUserProgress = spy(storage, "updateUserProgress");
    // get response
    const res = await POST(req);
    const message = await res.json();

    expect(message).toStrictEqual("User stats updated successfully");

    // spy on method
    const progressUpdated = spyUpdateUserProgress.calledWithExactly(
      "test_id",
      testStat,
      ["1", "2"]
    );

    expect(progressUpdated).toBeTruthy();

    // restore spy and stub
    spyUpdateUserProgress.restore();
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

  test("Should return `New stats required` if no stats provided", async function () {
    // test body
    const body = { id: "test_id" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("New stats required");
  });

  test("Should return `User id required` if no user id provided", async function () {
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
