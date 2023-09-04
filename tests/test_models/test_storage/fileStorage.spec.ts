// Unit tests for FileStorage class

import { IQuestion } from '@/models/interfaces';
import FileStorage from '../../../models/storage/fileStorage';
import { readFileSync, writeFileSync } from 'fs';
import { stub } from 'sinon'
import * as fs from 'fs'

beforeAll(function () {
  writeFileSync('file.json', JSON.stringify({}))
})

afterAll(function () {
  writeFileSync('file.json', JSON.stringify({}))
})

describe("FileStorage", function () {
  const storage = new FileStorage()

  beforeEach(function () {
    const question: IQuestion = {
      answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 'Answer 2',
      category: 'General Knowledge',
      difficulty: 'easy',
      id: '1',
      question: 'Some test question'
    }

    storage.new(question);
  })
  describe("new method", function () {
    test('Adds an object to storage', () => {
      const questionObj = storage.get({ name: 'Object' }, '1')
      expect(questionObj).toBeInstanceOf(Object)
    });
  })

  describe("all method", function () {
    test("Returns all objects in storage", function () {
      const stock = storage.all()
      const questionObj = stock["Object.1"]
      expect(questionObj).toEqual({ ...questionObj, __class__: 'Object' })
    })

    test("Returns all objects in storage belonging to a certain class", function () {
      const randomArray: Array<number> = [1, 2, 3]
      storage.new(randomArray);
      const stock = storage.all({ name: 'Object' })
      expect(Object.keys(stock).length).toStrictEqual(1)
    })
  })

  // describe("save method", function () {
  //   test("Serializes objects to file storage", function () {
  //     const stubWriteFileSync = stub(fs, 'writeFileSync')
  //     storage.save()
  //     const objects = JSON.stringify(storage.all())
  //     expect(stubWriteFileSync).toBeCalled()
  //   })
  // })

  describe("delete method", function () {
    test('Deletes an object from storage', function () {
      let question = storage.get({ name: 'Object' }, '1')
      storage.delete(question)
      question = storage.get({ name: 'Object' }, '1')
      expect(question).toBeUndefined()
    })
  })

  describe("get method", function () {
    test("Retrieves an object with `id` from storage belonging to `Class`", function () {
      const question = storage.get({ name: 'Object' }, '1')
      expect(question).toBeDefined()
    })
  })

  describe("filteredQuestions method", function () {
    const generateFakeData = () => {
      return [
        {
          answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
          correctAnswer: 'Answer 2',
          category: 'Science',
          difficulty: 'medium',
          id: '1',
          question: 'Some test question 2'
        },
        {
          answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
          correctAnswer: 'Answer 2',
          category: 'History',
          difficulty: 'hard',
          id: '1',
          question: 'Some test question 3'
        },
        {
          answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
          correctAnswer: 'Answer 2',
          category: 'General Knowledge',
          difficulty: 'easy',
          id: '1',
          question: 'Some test question'
        }
      ];
    };

    test("Returns a list of questions based on difficulty", function () {
      const stubAll = stub(storage, 'all');
      stubAll.callsFake(generateFakeData);

      const easyQuestions = storage.filterQuestions({ difficulty: 'easy' });
      expect(easyQuestions.length).toStrictEqual(1);
      expect(easyQuestions[0].difficulty).toStrictEqual('easy');

      stubAll.restore();
    });

    test("Returns a list of questions based on categories", function () {
      const stubAll = stub(storage, 'all');
      stubAll.callsFake(generateFakeData);

      const filteredQuestions = storage.filterQuestions({ categories: ['Science', 'History'] });
      expect(filteredQuestions.length).toStrictEqual(2);
      expect(filteredQuestions[0].category).toStrictEqual('Science');

      stubAll.restore();
    });
  })
})
