import storage from "@/models/index";
import Question from "@/models/question";
import { POST } from "@/app/api/questions/play/route";
import { stub } from "sinon";

describe("POST questions/play", function () {
  function generateFakeData(): Record<string, Question> {
    return {
      Question1: new Question({
        answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        correctAnswer: "Answer 2",
        category: "General Knowledge",
        difficulty: "easy",
        id: "1",
        question: "Some test question",
      }),
      Question2: new Question({
        answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        correctAnswer: "Answer 2",
        category: "Science",
        difficulty: "medium",
        id: "2",
        question: "Some test question 2",
      }),
      Question3: new Question({
        answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        correctAnswer: "Answer 2",
        category: "History",
        difficulty: "hard",
        id: "3",
        question: "Some test question 3",
      }),
      Question4: new Question({
        answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
        correctAnswer: "Answer 2",
        category: "General Knowledge",
        difficulty: "easy",
        id: "4",
        question: "Some test question 4",
      }),
    };
  }

  // create request
  const url = "http://localhost:3000/api/questions/play";

  test("Should return an array of filtered questions", async function () {
    // test body
    const body = { difficulty: "easy", categories: ["General Knowledge"] };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // stub storage.getAllQuestions
    const stubAll = stub(storage, "getAllQuestions");
    stubAll.callsFake(generateFakeData);

    // get response
    const res = await POST(req);
    const data = await res.json();

    expect(data.length).toStrictEqual(2);
    // Restore the stubbed method after the test
    stubAll.restore();
  });

  test("Should return an array of all questions", async function () {
    // test body
    const body = { difficulty: "", categories: [] };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // stub storage.getAllQuestions
    const stubAll = stub(storage, "getAllQuestions");
    stubAll.callsFake(generateFakeData);

    // get response
    const res = await POST(req);
    const data = await res.json();

    expect(data.length).toStrictEqual(4);
    // Restore the stubbed method after the test
    stubAll.restore();
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

  test("Should return `Invalid difficulty` if difficulty not `easy`, `hard`, `medium`", async function () {
    // test body
    const body = { difficulty: "professional" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("Invalid difficulty");
  });

  test("Should return `Invalid categories` if `categories` not an array", async function () {
    // test body
    const body = { categories: "Science: Mathematics" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const error = await res.json();

    expect(error).toStrictEqual("Invalid categories");
  });
});
