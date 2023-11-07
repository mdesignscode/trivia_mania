// Unit tests for FileStorage class

import Question from "@/models/question";
import { QuestionsRecord } from "@/models/storage/fileStorage/baseModel";
import QuestionStorage from "@/models/storage/fileStorage/question";
import { ANSWERED_QUESTIONS } from "@/utils/localStorage_utils";
import { generateFakeData } from "@/utils/test_utils_api";
import { storageHelpers } from "@/utils/test_utils_storage";
import { stub } from "sinon";

describe("Question class", function () {
  const storage = new QuestionStorage()

  const { createMockUser, setMockUserAttribute } = storageHelpers(storage)

  beforeEach(() => {
    createMockUser()
  })

  function saveMockQuestions() {
    const { Question1, Question2, Question3, Question4 } = generateFakeData()

    storage.newQuestion([Question1, Question2, Question3, Question4])
  }

  describe("newQuestion method", function () {
    test("Adds a question to storage by duplicating it across the `Category` and `Difficulty`", () => {
      const { Question1 } = generateFakeData();

      // save `General Knowledge` `easy` question
      storage.newQuestion(Question1);

      // should create entries for `General Knowledge` and `easy`
      const questionEasy = storage.getQuestion("difficulties", "easy", "1");
      const questionGeneral = storage.getQuestion("categories", "General Knowledge", "1");
      expect(questionEasy).toBeDefined();
      expect(questionGeneral).toBeDefined();

      let allQuestions = storage.getAllQuestions() as QuestionsRecord;

      expect(Object.keys(allQuestions).length).toBe(2);

      // add more questions to storage
      saveMockQuestions()

      const question4 = storage.getQuestion("categories", "General Knowledge", "4");
      const questionScience = storage.getQuestion("categories", "Science", "2");
      const questionHistory = storage.getQuestion("categories", "History", "3");

      expect(question4).toBeDefined();
      expect(questionScience).toBeDefined();
      expect(questionHistory).toBeDefined();

      // storage now has 4 questions
      allQuestions = storage.getAllQuestions() as QuestionsRecord;
      expect(Object.keys(allQuestions).length).toBe(6);

      const uniqueQuestions = storage.getAllQuestions(true) as Record<
        string,
        Question
      >;
      expect(Object.keys(uniqueQuestions).length).toBe(4);
    });
  });

  describe("getQuestionsByFilter method", function () {
    test("Returns all questions in storage based on a filter", function () {
      saveMockQuestions()

      const stock = storage.getQuestionsByFilter("difficulties", "easy");
      const questionObj = stock["1"];

      expect(questionObj).toBeDefined();
      expect(Object.keys(stock)).toHaveLength(2);
    });

    test("Returns all questions in storage unique to a user based on a filter", function () {
      saveMockQuestions()
      setMockUserAttribute(ANSWERED_QUESTIONS, ["1"])

      const stock = storage.getQuestionsByFilter("difficulties", "easy", "mockId");
      const questionObj = stock["4"];

      expect(questionObj).toBeDefined();
      expect(Object.keys(stock)).toHaveLength(1);
    });
  });

  describe("getQuestion method", function () {
    test("Retrieves a question with `id`", function () {
      const { Question1 } = generateFakeData();
      storage.newQuestion(Question1);

      const question = storage.getQuestion("difficulties", "easy", "1");
      expect(question).toBeDefined();
    });
  });

  describe("getAllQuestions method", function () {
    test("Returns an object with all questions in storage in a single record", function () {
      saveMockQuestions()

      const stock = storage.getAllQuestions(true);
      expect(Object.keys(stock)).toHaveLength(4);
    });

    test("Returns an object with all questions in storage in a single record, unique to a user", function () {
      setMockUserAttribute(ANSWERED_QUESTIONS, ["2", "3"])
      saveMockQuestions()

      const stock = storage.getAllQuestions(true, "mockId");
      expect(Object.keys(stock)).toHaveLength(2);
    });

    test("Returns an object with all questions in storage by filter record, unique to a user", function () {
      setMockUserAttribute(ANSWERED_QUESTIONS, ["2", "3"])
      saveMockQuestions()

      const stock = storage.getAllQuestions(false, "mockId");
      expect(Object.keys(stock)).toHaveLength(2);
    });

    test("Returns an object with all questions in storage by filter record", function () {
      saveMockQuestions()

      const stock = storage.getAllQuestions();
      expect(Object.keys(stock)).toHaveLength(6);
    });
  });

  describe("filterQuestions method", function () {
    test("Returns a list of questions based on difficulty", function () {
      const stubAll = stub(storage, "getAllQuestions");
      stubAll.callsFake(generateFakeData);

      const easyQuestions = storage.filterQuestions({ difficulty: "easy" });
      expect(easyQuestions.length).toBe(2);
      expect(easyQuestions[0].difficulty).toBe("easy");

      stubAll.restore();
    });

    test("Returns a list of questions based on categories", function () {
      const stubAll = stub(storage, "getAllQuestions");
      stubAll.callsFake(generateFakeData);

      const filteredQuestions = storage.filterQuestions({
        categories: ["Science", "History"],
      });
      expect(filteredQuestions.length).toBe(2);

      stubAll.restore();
    });

    test("Returns a list of all questions", function () {
      const stubAll = stub(storage, "getAllQuestions");
      stubAll.callsFake(generateFakeData);

      const filteredQuestions = storage.filterQuestions({
        categories: [],
        difficulty: "",
      });
      expect(filteredQuestions.length).toBe(4);

      stubAll.restore();
    });
  });

  describe("questionsStats method", function () {

    test("Return an object with stats count for all difficulties", function () {
      const stats = storage.questionsStats("difficulties");

      const easyCount = stats.easy;
      const mediumCount = stats.medium;
      const hardCount = stats.hard;

      expect(easyCount).toBe(2);
      expect(mediumCount).toBe(1);
      expect(hardCount).toBe(1);
    });

    test("Return an object with stats count for all difficulties, unique to a user", function () {
      setMockUserAttribute(ANSWERED_QUESTIONS, ["1", "2"])
      const stats = storage.questionsStats("difficulties", "mockId");

      const easyCount = stats.easy;
      const hardCount = stats.hard;

      expect(easyCount).toBe(1);
      expect(hardCount).toBe(1);
    });

    test("Return an object with categories count based on difficulty", function () {
      const easyStats = storage.questionsStats("categories", "easy");

      const generalCount = easyStats["General Knowledge"];
      const allEasy = easyStats["all categories"];

      expect(generalCount).toBe(2);
      expect(allEasy).toBe(2);
    });

    test("Return an object with stats count based on filters, excluding questions a user has already answered", function () {
      const easyStats = storage.questionsStats("categories", "easy", "mockId");

      const easyCount = Object.keys(easyStats).length;
      const generalCount = easyStats["General Knowledge"];
      const allEasy = easyStats["all categories"];

      expect(easyCount).toBe(2);
      expect(generalCount).toBe(2);
      expect(allEasy).toBe(2);
    });
  });
});
