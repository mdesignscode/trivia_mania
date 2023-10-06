// Unit tests for FileStorage class

import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { stub } from "sinon";
import Question from "@/models/question";
import FileStorage, {
  IStorageObjects,
  QuestionsRecord,
} from "@/models/storage/fileStorage";
import User from "@/models/user";
import { initialStat } from "@/models/interfaces";

beforeAll(function () {
  writeFileSync("file.json", JSON.stringify({}));
});

afterAll(function () {
  writeFileSync("file.json", JSON.stringify({}));
});

describe("FileStorage", function () {
  const storage = new FileStorage();
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

  afterEach(function () {
    storage.clearMemory();
  });

  describe("Test Question functionality", function () {
    afterEach(function () {
      storage.clearMemory();
    });

    describe("newQuestion method", function () {
      test("Adds a question to storage by duplicating it across the `Category` and `Difficulty`", () => {
        const { Question1, Question2, Question3, Question4 } =
          generateFakeData();

        // save `General Knowledge` `easy` question
        storage.newQuestion(Question1);

        // should create entries for `General Knowledge` and `easy`
        const questionEasy = storage.getQuestion("easy", "1");
        const questionGeneral = storage.getQuestion("General Knowledge", "1");
        expect(questionEasy).toBeDefined();
        expect(questionGeneral).toBeDefined();

        let allQuestions = storage.getAllQuestions() as QuestionsRecord;

        expect(Object.keys(allQuestions).length).toStrictEqual(2);

        // add more questions to storage
        storage.newQuestion([Question4, Question3, Question2]);

        const question4 = storage.getQuestion("General Knowledge", "4");
        const questionScience = storage.getQuestion("Science", "2");
        const questionHistory = storage.getQuestion("History", "3");

        expect(question4).toBeDefined();
        expect(questionScience).toBeDefined();
        expect(questionHistory).toBeDefined();

        // storage now has 4 questions
        allQuestions = storage.getAllQuestions() as QuestionsRecord;
        expect(Object.keys(allQuestions).length).toStrictEqual(6);

        const uniqueQuestions = storage.getAllQuestions(true) as Record<
          string,
          Question
        >;
        expect(Object.keys(uniqueQuestions).length).toStrictEqual(4);
      });
    });

    describe("getQuestionsByFilter method", function () {
      test("Returns all questions in storage based on a filter", function () {
        const { Question1, Question2, Question3 } = generateFakeData();

        storage.newQuestion([Question3, Question2, Question1]);

        const stock = storage.getQuestionsByFilter("easy");
        const questionObj = stock["1"];

        expect(questionObj).toBeDefined();
        expect(Object.keys(stock).length).toStrictEqual(1);
      });

      test("Returns all questions in storage a user hasn't answered yet based on a filter", function () {
        const { Question1, Question2, Question3, Question4 } =
          generateFakeData();
        const joe = new User("joe", "", initialStat, "", ["1"]);

        storage.newUser(joe);
        storage.newQuestion([Question3, Question2, Question1, Question4]);

        const stock = storage.getQuestionsByFilter("easy", joe.id);
        const questionObj = stock["4"];

        expect(questionObj).toBeDefined();
        expect(Object.keys(stock).length).toStrictEqual(1);
      });
    });

    describe("getQuestion method", function () {
      test("Retrieves a question with `id`", function () {
        const { Question1 } = generateFakeData();
        storage.newQuestion(Question1);

        const question = storage.getQuestion("easy", "1");
        expect(question).toBeDefined();
      });
    });

    describe("getAllQuestions method", function () {
      test("Returns an object with all questions in storage in a single record", function () {
        const { Question2, Question3, Question4 } = generateFakeData();
        storage.newQuestion([Question4, Question3, Question2]);

        const stock = storage.getAllQuestions(true);
        expect(Object.keys(stock).length).toStrictEqual(3);
      });

      test("Returns an object with all questions in storage in a single record, that a user hasn't answered yet", function () {
        const { Question2, Question3, Question4 } = generateFakeData();
        const joe = new User("joe", "", initialStat, "", ["2", "3"]);

        storage.newUser(joe);

        storage.newQuestion([Question4, Question3, Question2]);

        const stock = storage.getAllQuestions(true, joe.id);
        expect(Object.keys(stock).length).toStrictEqual(1);
      });

      test("Returns an object with all questions in storage by filter record, excluding questions a given user has already answered", function () {
        const { Question2, Question3, Question4 } = generateFakeData();
        const joe = new User("joe", "", initialStat, "", ["2", "3"]);

        storage.newUser(joe);
        storage.newQuestion([Question2, Question3, Question4]);

        const stock = storage.getAllQuestions();
        expect(Object.keys(stock).length).toStrictEqual(6);
      });

      test("Returns an object with all questions in storage by filter record", function () {
        const { Question2, Question3, Question4 } = generateFakeData();
        storage.newQuestion([Question2, Question3, Question4]);

        const stock = storage.getAllQuestions();
        expect(Object.keys(stock).length).toStrictEqual(6);
      });
    });

    describe("filterQuestions method", function () {
      test("Returns a list of questions based on difficulty", function () {
        const stubAll = stub(storage, "getAllQuestions");
        stubAll.callsFake(generateFakeData);

        const easyQuestions = storage.filterQuestions({ difficulty: "easy" });
        expect(easyQuestions.length).toStrictEqual(2);
        expect(easyQuestions[0].difficulty).toStrictEqual("easy");

        stubAll.restore();
      });

      test("Returns a list of questions based on categories", function () {
        const stubAll = stub(storage, "getAllQuestions");
        stubAll.callsFake(generateFakeData);

        const filteredQuestions = storage.filterQuestions({
          categories: ["Science", "History"],
        });
        expect(filteredQuestions.length).toStrictEqual(2);

        stubAll.restore();
      });

      test("Returns a list of all questions", function () {
        const stubAll = stub(storage, "getAllQuestions");
        stubAll.callsFake(generateFakeData);

        const filteredQuestions = storage.filterQuestions({
          categories: [],
          difficulty: "",
        });
        expect(filteredQuestions.length).toStrictEqual(4);

        stubAll.restore();
      });
    });

    describe("questionsStats method", function () {
      beforeEach(function () {
        const { Question1, Question2, Question3, Question4 } =
          generateFakeData();

        const joe = new User("joe", "1", initialStat, "", ["1", "2"]);

        storage.newUser(joe);
        storage.newQuestion([Question4, Question3, Question2, Question1]);
      });

      test("Return an object with stats count for all filters", function () {
        const stats = storage.questionsStats();

        const easyCount = stats.easy;
        const mediumCount = stats.medium;
        const hardCount = stats.hard;
        const scienceCount = stats.Science;

        expect(easyCount).toStrictEqual(2);
        expect(mediumCount).toStrictEqual(1);
        expect(hardCount).toStrictEqual(1);
        expect(scienceCount).toStrictEqual(1);
      });

      test("Return an object with stats count for all filters, excluding a given user's answered questions", function () {
        const stats = storage.questionsStats("", "1");

        const easyCount = stats.easy;
        const mediumCount = stats.medium;
        const hardCount = stats.hard;
        const scienceCount = stats.Science;

        expect(easyCount).toStrictEqual(1);
        expect(mediumCount).toStrictEqual(0);
        expect(hardCount).toStrictEqual(1);
        expect(scienceCount).toStrictEqual(0);
      });

      test("Return an object with stats count based on filters", function () {
        const easyStats = storage.questionsStats("easy");

        const easyCount = Object.keys(easyStats).length;
        const generalCount = easyStats["General Knowledge"];
        const allEasy = easyStats["all categories"];

        expect(easyCount).toStrictEqual(2);
        expect(generalCount).toStrictEqual(2);
        expect(allEasy).toStrictEqual(2);
      });

      test("Return an object with stats count based on filters, excluding questions a user has already answered", function () {
        const easyStats = storage.questionsStats("easy");

        const easyCount = Object.keys(easyStats).length;
        const generalCount = easyStats["General Knowledge"];
        const allEasy = easyStats["all categories"];

        expect(easyCount).toStrictEqual(2);
        expect(generalCount).toStrictEqual(2);
        expect(allEasy).toStrictEqual(2);
      });
    });
  });

  describe("Test User functionality", function () {
    const mike23 = new User("mike23");

    describe("newUser and getUser methods", function () {
      test("Adds a new user to storage", function () {
        storage.newUser(mike23);
        const mike = storage.getUser(mike23.id);

        expect(mike).toBeDefined();
      });

      test("Adds a list of new users to storage", function () {
        const joe = new User("joe");
        const sam = new User("sam");
        storage.newUser([mike23, sam, joe]);

        const mikeUser = storage.getUser(mike23.id);
        const joeUser = storage.getUser(joe.id);
        const samUser = storage.getUser(sam.id);

        expect(mikeUser).toBeDefined();
        expect(joeUser).toBeDefined();
        expect(samUser).toBeDefined();
      });
    });

    describe("deleteUser method", function () {
      test("Deletes a user from storage", function () {
        storage.newUser(mike23);
        const mike = storage.getUser(mike23.id) as User;

        expect(mike).toBeDefined();

        storage.deleteUser(mike.id);

        const deletedMike = storage.getUser(mike23.id);
        expect(deletedMike).toBeNull();
      });
    });

    describe("updateUserProgress and getUserStats methods", function () {
      test("Updates a user's progress on a round and retrieves a user's stats", function () {
        storage.newUser(mike23);
        const testStat = {
          easy: {
            answered: 15,
            correctAnswered: 10,
          },
          Science: {
            easy: {
              answered: 10,
              correctAnswered: 7,
            },
          },
          History: {
            easy: {
              answered: 5,
              correctAnswered: 3,
            },
          },
          total: {
            answered: 15,
            correctAnswered: 10,
          },
        };

        storage.updateUserProgress(mike23.id, testStat, []);

        const mikeStats = storage.getUserStats(mike23.id);

        expect(mikeStats).toEqual(testStat);
      });
    });

    describe("getTopTenUsers method", function () {
      test("Returns an Array of users sorted by correct answers", function () {
        const mike = new User("mike");
        const joe = new User("joe");
        const mack = new User("mack");

        storage.newUser(mike);
        storage.newUser(joe);
        storage.newUser(mack);

        const testStat = {
          total: {
            answered: 15,
            correctAnswered: 10,
          },
        };
        const testStat2 = {
          total: {
            answered: 20,
            correctAnswered: 15,
          },
        };
        const testStat3 = {
          total: {
            answered: 12,
            correctAnswered: 8,
          },
        };

        mike.stats = testStat;
        joe.stats = testStat2;
        mack.stats = testStat3;

        const [joeStats, mikeStats, mackStats] = storage.getTopTenUsers();

        expect(mikeStats.username).toStrictEqual("mike");
        expect(joeStats.username).toStrictEqual("joe");
        expect(mackStats.username).toStrictEqual("mack");
      });
    });
  });

  describe("save method", function () {
    test("Serializes objects to file storage", function () {
      const { Question1 } = generateFakeData();
      const mike = new User("mike");

      storage.newQuestion(Question1);
      storage.newUser(mike);
      storage.save();

      const data: IStorageObjects = JSON.parse(
        readFileSync("file.json", "utf-8")
      );
      const easyQuestion = data.Questions.easy["1"];
      expect(easyQuestion).toBeDefined();
      const mikeUser = data.Users[mike.id];
      expect(mikeUser).toBeDefined();

      writeFileSync("file.json", JSON.stringify({}));
    });
  });

  describe("reload method", function () {
    test("Deserializes objects to memory", function () {
      const { Question2 } = generateFakeData();

      storage.newQuestion(Question2);
      storage.save();

      storage.reload();

      const mediumQuestion = storage.getQuestion("medium", "2");
      expect(mediumQuestion).toBeDefined();
    });

    test("Should create an empty object in memory if file doesn't exist", function () {
      try {
        unlinkSync("file.json");
      } catch (err) {}
      storage.reload();
      const allQuestions = storage.getAllQuestions();
      expect(Object.keys(allQuestions).length).toStrictEqual(0);
    });

    test("Should deserialize objects back to their original class", function () {
      const { Question2 } = generateFakeData();
      const mike = new User("mike");

      storage.newUser(mike);
      storage.newQuestion(Question2);
      storage.save();

      storage.reload();

      const mediumQuestion = storage.getQuestion("medium", "2");
      const mikeUser = storage.getUser(mike.id);

      expect(mediumQuestion).toBeInstanceOf(Question);
      expect(mikeUser).toBeInstanceOf(User);
    });
  });
});
