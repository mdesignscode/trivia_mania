#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import Question from '../question';

interface IFilters {
  difficulty?: string,
  categories?: Array<string>
}

/**
 * Storage engine for storing objects in file storage
 * @date 04/09/2023 - 09:54:39
 *
 * @class FileStorage
 * @typedef {FileStorage}
 */
class FileStorage {
  private filePath: string = 'file.json';
  private objects: Record<string, any> = {};

  /**
   * Adds a question to storage
   * @date 05/09/2023 - 20:36:02
   *
   * @param {Question} obj - the question to be added
   */
  newQuestion(obj: Question): void {
    this.objects[`Question.${obj.difficulty}`] = {
      ...this.objects[`Question.${obj.difficulty}`],
      [`Question.${obj.id}`]: {
        ...obj,
        __class__: 'Question'
      },
      __class__: 'Question'
    };
    this.objects[`Question.${obj.category}`] = {
      ...this.objects[`Question.${obj.difficulty}`],
      [`Question.${obj.id}`]: {
        ...obj,
        __class__: 'Question'
      },
      __class__: 'Question'
    };
  }

  /**
   * Retrieves all questions by filter
   * @date 05/09/2023 - 21:01:14
   *
   * @param {string} filter - Either `difficulty name` or `category name`
   * @returns {Record<string, Question>}
   */
  getQuestionsByFilter(filter: string): Record<string, Question> {
    const filteredQuestions = this.objects[`Question.${filter}`]
    delete filteredQuestions.__class__
    return filteredQuestions
  }

  /**
   * Retrieve a question of a specific filter from storage
   * @date 05/09/2023 - 20:51:30
   *
   * @param {string} filter - Either `difficulty name` or `category name`
   * @param {string} id - the id of the question
   * @returns {Question}
   */
  getQuestion(filter: string, id: string): Question {
    return this.objects[`Question.${filter}`][`Question.${id}`]
  }

  /**
   * Retrieves all questions in storage
   * @date 06/09/2023 - 12:28:50
   *
   * @param {boolean} [byFilter=true] - Set to false to get all questions in a single record
   * @returns {Record<string, Question>}
   */
  getAllQuestions(byFilter: boolean = true): Record<string, Question> | Record<string, Record<string, Question>> {
    const allQuestions: Record<string, Record<string, Question>> = {};
    const uniqueQuestions: Record<string, Question> = {};

    for (const key in this.objects) {
      if (this.objects[key].__class__ === "Question") {
        for (const subKey in this.objects[key]) {
          if (subKey !== '__class__') {
            uniqueQuestions[subKey] = this.objects[key][subKey]
            allQuestions[key] = {
              ...allQuestions[key],
              [subKey]: this.objects[key][subKey]
            }
          }
        }
      }
    }

    return byFilter
      ? allQuestions
      : uniqueQuestions
  }

  /**
   * Returns a list of filtered questions based on provided filters
   * @date 04/09/2023 - 13:11:21
   *
   * @param {IFilters} filters
   * @returns {Array<Question>}
   */
  filterQuestions(filters: IFilters): Array<Question> {
    const questions = this.getAllQuestions(false) as Record<string, Question>;
    const filteredCategories: Array<Question> = filters.categories
      ? Object.values(questions).filter((question) => filters.categories?.includes(question.category))
      : Object.values(questions).map((question) => question)
    const filteredQuestions = filters.difficulty
      ? filteredCategories.filter(question => question.difficulty === filters.difficulty)
      : filteredCategories

    return filteredQuestions
  }

  /**
   * Counts each filter in storage
   * @date 06/09/2023 - 22:00:59
   *
   * @returns {Record<string, number>}
   */
  questionsStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    const uniqueQuestions = this.getAllQuestions(false)
    const allQuestions = this.getAllQuestions()

    for (const key in allQuestions) {
      const stat = key.split('.')[1]
      stats[stat] = Object.keys(allQuestions[key]).length
    }

    stats['all difficulties'] = Object.keys(uniqueQuestions).length
    stats['all categories'] = Object.keys(uniqueQuestions).length

    return stats
  }

  /**
   * Serializes all objects to storage file
   */
  save(): void {
    const jsonData = JSON.stringify(this.objects);
    writeFileSync(this.filePath, jsonData, 'utf-8');
  }

  /**
   * Deserializes objects in file storage
   */
  reload(): void {
    let data: Record<string, any>;
    try {
      data = JSON.parse(readFileSync(this.filePath, 'utf-8'));
    } catch (error) {
      data = {};
    }
    Object.assign(this.objects, data);
  }

  /**
   * Clears objects in memory. For testing purposes only!
   * @date 06/09/2023 - 13:28:43
   */
  clearMemory(): void {
    this.objects = {}
  }
}

export default FileStorage;
