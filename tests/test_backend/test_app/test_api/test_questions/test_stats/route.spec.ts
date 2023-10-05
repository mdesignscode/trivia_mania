import storage from "../../../../../models/index";
import Question from "../../../../../models/question";
import { POST } from "../../../../../app/api/questions/stats/route";
import { stub } from "sinon";

describe("POST questions/stats", function () {
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
  const url = "http://localhost:3000/api/questions/stats";

  test("Should return a record of question stats based on a difficulty", async function () {
    // stub storage.questionsStats
    const stubbedQuestionsStats = () => ({
      easy: 2,
      "General Knowledge": 2,
      "all categories": 2
    });
    const stubQuestionsStats = stub(storage, "questionsStats");
    stubQuestionsStats.callsFake(stubbedQuestionsStats);

    // create request
    const body = { difficulty: "easy" };
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // get response
    const res = await POST(req);
    const data = await res.json();

    expect(data["all categories"]).toStrictEqual(2);
    expect(data["General Knowledge"]).toStrictEqual(2);
    expect(data.easy).toStrictEqual(2);

    // Restore the stubbed method after the test
    stubQuestionsStats.restore();
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
});
