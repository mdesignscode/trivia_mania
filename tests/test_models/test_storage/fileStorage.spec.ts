// Unit tests for FileStorage class

import { IQuestion } from '@/models/interfaces';
import FileStorage from '../../../models/storage/fileStorage';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { stub } from 'sinon';
import Question from '../../../models/question';

beforeAll(function () {
  writeFileSync('file.json', JSON.stringify({}));
});

afterAll(function () {
  writeFileSync('file.json', JSON.stringify({}));
});

describe("FileStorage", function () {
  const storage = new FileStorage();
  function generateFakeData (): Record<string, Question> {
    return {
      Question1: new Question({
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correctAnswer: 'Answer 2',
        category: 'General Knowledge',
        difficulty: 'easy',
        id: '1',
        question: 'Some test question'
      }),
      Question2: new Question({
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correctAnswer: 'Answer 2',
        category: 'Science',
        difficulty: 'medium',
        id: '2',
        question: 'Some test question 2'
      }),
      Question3: new Question({
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correctAnswer: 'Answer 2',
        category: 'History',
        difficulty: 'hard',
        id: '3',
        question: 'Some test question 3'
      }),
      Question4: new Question({
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correctAnswer: 'Answer 2',
        category: 'General Knowledge',
        difficulty: 'easy',
        id: '4',
        question: 'Some test question 4'
      })
    };
  };

  afterEach(function () {
    storage.clearMemory()
  });
  describe("newQuestion method", function () {
    test('Adds a question to storage by duplicating it across the `Category` and `Difficulty`', () => {
      const { Question1 } = generateFakeData()
      storage.newQuestion(Question1)

      const questionEasy = storage.getQuestion('easy', '1');
      expect(questionEasy).toBeDefined();

      const { Question4 } = generateFakeData();
      storage.newQuestion(Question4);

      const questionGeneral = storage.getQuestion('General Knowledge', '1');
      const questionGeneral4 = storage.getQuestion('General Knowledge', '4');
      expect(questionGeneral).toBeDefined();
      expect(questionGeneral4).toBeDefined();
    });
  });

  describe("getQuestionsByFilter method", function () {
    test("Returns all questions in storage based on a filter", function () {
      const { Question1, Question2, Question3 } = generateFakeData();

      storage.newQuestion(Question1);
      storage.newQuestion(Question2);
      storage.newQuestion(Question3);

      const stock = storage.getQuestionsByFilter('easy');
      const questionObj = stock['Question.1'];

      expect(questionObj).toBeDefined();
      expect(Object.keys(stock).length).toStrictEqual(1);
    });
  });

  describe("getQuestion method", function () {
    test("Retrieves a question with `id`", function () {
      const { Question1 } = generateFakeData();
      storage.newQuestion(Question1);

      const question = storage.getQuestion('easy', '1');
      expect(question).toBeDefined();
    });
  });

  describe("getAllQuestions method", function () {
    test("Returns an object with all questions in storage in a single record", function () {
      const { Question2, Question3, Question4 } = generateFakeData();
      storage.newQuestion(Question2);
      storage.newQuestion(Question3);
      storage.newQuestion(Question4);

      const stock = storage.getAllQuestions(false);
      expect(Object.keys(stock).length).toStrictEqual(3);
    });

    test("Returns an object with all questions in storage by filter record", function () {
      const { Question2, Question3, Question4 } = generateFakeData();
      storage.newQuestion(Question2);
      storage.newQuestion(Question3);
      storage.newQuestion(Question4);

      const stock = storage.getAllQuestions();
      expect(Object.keys(stock).length).toStrictEqual(6);
    });
  });

  describe("filterQuestions method", function () {
    test("Returns a list of questions based on difficulty", function () {
      const stubAll = stub(storage, 'getAllQuestions');
      stubAll.callsFake(generateFakeData);

      const easyQuestions = storage.filterQuestions({ difficulty: 'easy' });
      expect(easyQuestions.length).toStrictEqual(2);
      expect(easyQuestions[0].difficulty).toStrictEqual('easy');

      stubAll.restore();
    });

    test("Returns a list of questions based on categories", function () {
      const stubAll = stub(storage, 'getAllQuestions');
      stubAll.callsFake(generateFakeData);

      const filteredQuestions = storage.filterQuestions({ categories: ['Science', 'History'] });
      expect(filteredQuestions.length).toStrictEqual(2);
      expect(filteredQuestions[0].category).toStrictEqual('Science');

      stubAll.restore();
    });
  });

  describe("questionsStats method", function () {
    const { Question1, Question2, Question3, Question4 } = generateFakeData();

    storage.newQuestion(Question1);
    storage.newQuestion(Question2);
    storage.newQuestion(Question3);
    storage.newQuestion(Question4);

    const stats = storage.questionsStats()

    const easyCount = stats.easy
    const mediumCount = stats.medium
    const hardCount = stats.hard
    const scienceCount = stats.Science

    expect(easyCount).toStrictEqual(2)
    expect(mediumCount).toStrictEqual(1)
    expect(hardCount).toStrictEqual(1)
    expect(scienceCount).toStrictEqual(1)
  });

  describe("save method", function () {
    test("Serializes objects to file storage", function () {
      const { Question1 } = generateFakeData();

      storage.newQuestion(Question1);
      storage.save();

      const data: Record<string, any> = JSON.parse(readFileSync('file.json', 'utf-8'));
      const easyQuestion = data['Question.easy']['Question.1'];
      expect(easyQuestion).toBeDefined();
      writeFileSync('file.json', JSON.stringify({}));
    });
  });

  describe("reload method", function () {
    test("Deserializes objects to memory", function () {
      const { Question2 } = generateFakeData();

      storage.newQuestion(Question2)
      storage.save()

      storage.reload();

      const mediumQuestion = storage.getQuestion('medium', '2');
      expect(mediumQuestion).toBeDefined();
    });

    test(
      "Should create an empty object in memory if file doesn't exist",
      function () {
        try {
          unlinkSync("file.json");
        } catch (err) {
          ;
        }
        storage.reload()
        const allQuestions = storage.getAllQuestions()
        expect(Object.keys(allQuestions).length).toStrictEqual(0)
      }
    );
  });
});
