import { stub } from "sinon";
import storage from "../models";
import Question from "../models/question";
import FileStorage from "../models/storage/fileStorage";
import User from "../models/user";

export function curryLibrary<RequestType>(POST: Function, url: string) {
  function createMockRequest() {
    return (body: RequestType) => new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async function errorAsserter(body: RequestType, message: string) {
    // test body
    const req = createMockRequest()(body)

    expect.assertions(1);
    try {
      // get error
      await POST(req);
    } catch (e: any) {
      expect(e.message).toMatch(message);
    }
  }

  async function getMockResponse(req: Request, stubMethod?: keyof FileStorage, cb: (...args: never) => any = generateFakeData) {
    let stubbedMethod;
    if (stubMethod) {
      // stub method on storage
      stubbedMethod = stub(storage, stubMethod);
      stubbedMethod.callsFake(cb);
    }

    // get response
    const res = await POST(req);
    const data = await res.json();

    if (stubbedMethod) {
      // Restore the stubbed method after the test
      stubbedMethod.restore();
    }

    return data
  }

  return {
    requestCreator: createMockRequest(),
    errorAsserter,
    getMockResponse
  }
}

export function generateFakeData(): Record<string, Question> {
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

export function setMockUserAttribute(attribute: string, value: any) {
  // create mock user to update attribute
  const mockUser = storage.getUser("mockId") as User
  Object.assign(mockUser, { [attribute]: value })
  storage.newUser(mockUser)
}

export function saveMockQuestions() {
  // save some questions
  const { Question1, Question2, Question3, Question4 } = generateFakeData()
  storage.newQuestion([Question1, Question2, Question3, Question4])
}
