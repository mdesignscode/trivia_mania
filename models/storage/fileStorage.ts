#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import Question from "../question";
import User from "../user";

type UserStats = Record<string, Record<string, any>>;

interface IFilters {
  difficulty?: string;
  categories?: Array<string>;
}

/**
 * Storage engine for storing objects in file storage
 * @date 04/09/2023 - 09:54:39
 *
 * @class FileStorage
 * @typedef {FileStorage}
 */
class FileStorage {
  private filePath: string = "file.json";
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
        __class__: "Question",
      },
      __class__: "Question",
    };
    this.objects[`Question.${obj.category}`] = {
      ...this.objects[`Question.${obj.difficulty}`],
      [`Question.${obj.id}`]: {
        ...obj,
        __class__: "Question",
      },
      __class__: "Question",
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
    const filteredQuestions = this.objects[`Question.${filter}`];
    try {
      delete filteredQuestions.__class__;
    } catch (error) {}
    return filteredQuestions;
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
    return this.objects[`Question.${filter}`][`Question.${id}`];
  }

  /**
   * Retrieves all questions in storage
   * @date 06/09/2023 - 12:28:50
   *
   * @param {boolean} [byFilter=true] - Set to false to get all questions in a single record
   * @returns {Record<string, Question>}
   */
  getAllQuestions(
    byFilter: boolean = true
  ): Record<string, Question> | Record<string, Record<string, Question>> {
    const allQuestions: Record<string, Record<string, Question>> = {};
    const uniqueQuestions: Record<string, Question> = {};

    for (const key in this.objects) {
      if (this.objects[key].__class__ === "Question") {
        for (const subKey in this.objects[key]) {
          if (subKey !== "__class__") {
            const questionObj = this.objects[key][subKey];
            uniqueQuestions[subKey] = questionObj;
            allQuestions[key] = {
              ...allQuestions[key],
              [subKey]: questionObj,
            };
          }
        }
      }
    }

    return byFilter ? allQuestions : uniqueQuestions;
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
      ? Object.values(questions).filter((question) =>
          filters.categories?.includes(question.category)
        )
      : Object.values(questions).map((question) => question);
    const filteredQuestions = filters.difficulty
      ? filteredCategories.filter(
          (question) => question.difficulty === filters.difficulty
        )
      : filteredCategories;

    return filteredQuestions;
  }

  /**
   * If no difficulty is specified, counts all all filters in storage, else count categories by difficulty
   * @date 08/09/2023 - 11:18:18
   *
   * @param {IFilters} filters
   * @returns {Record<string, number>}
   */
  questionsStats(difficulty: string = ""): Record<string, number> {
    const stats: Record<string, number> = {};
    let uniqueQuestions: Record<string, Question>;

    uniqueQuestions = difficulty
      ? this.getQuestionsByFilter(difficulty)
      : (this.getAllQuestions(false) as Record<string, Question>);

    const uniqueValues = Object.values(uniqueQuestions);
    if (difficulty) {
      for (const value of uniqueValues) {
        const category = value.category;
        if (!stats[category]) {
          const statCount = uniqueValues.filter((question) => {
            return question.category === category;
          });
          stats[category] = statCount.length;
        }
      }
      stats["all categories"] = Object.keys(uniqueQuestions).length;
    } else {
      const allQuestions = this.getAllQuestions();
      for (const key in allQuestions) {
        const stat = key.split(".")[1];
        stats[stat] = Object.keys(allQuestions[key]).length;
      }

      stats["all difficulties"] = Object.keys(uniqueQuestions).length;
      stats["all categories"] = Object.keys(uniqueQuestions).length;
    }

    return stats;
  }

  /**
   * Adds a user or a list of users to storage
   * @date 15/09/2023 - 14:28:56
   *
   * @param {(User | Array<User>)} user
   */
  newUser(user: User | Array<User>) {
    if (!this.objects.Users) {
      this.objects.Users = {};
    }

    if (Array.isArray(user)) {
      const users = user as Array<User>

      users.forEach(user => this.objects.Users[user.id] = user)
    } else {
      const NewUser = user as User
      this.objects.Users[NewUser.id] = user
    }
  }

  /**
   * deletes a user from storage
   * @date 15/09/2023 - 13:36:47
   *
   * @param {string} id
   */
  deleteUser(id: string) {
    const users = this.objects.Users

    if (users && users[id])
      delete users[id]
  }

  /**
   * Retrieves a user
   * @date 11/09/2023 - 00:45:12
   *
   * @param {string} id - the user's id
   * @returns {User}
   */
  getUser(id: string): User {
    return this.objects.Users[id];
  }

  /**
   * Saves a user's progress on a round
   * @date 11/09/2023 - 16:12:07
   *
   * @param {string} id - the user's id
   * @param {UserStats} stats
   */
  updateUserProgress(id: string, stats: UserStats) {
    const user = this.getUser(id);
    user.submitRound(stats);
    this.save();
  }

  /**
   * Retrieves a user's progress
   * @date 11/09/2023 - 00:51:09
   *
   * @param {string} id - the user's id
   * @returns {UserStats}
   */
  getUserStats(id: string): UserStats {
    return this.getUser(id).stats;
  }

  /**
   * Retrieves top ten scoring users
   * @date 11/09/2023 - 00:54:37
   *
   * @returns {Array<User>}
   */
  getTopTenUsers(): Array<User> {
    const usersList = Object.values(this.objects.Users) as Array<User>;
    const users = usersList.filter((user) => Object.keys(user.stats).length > 0)
    const sortedUsers = users.sort((a, b) => {
      const userA = calculateTotalScore(a as User);
      const userB = calculateTotalScore(b as User);
      return userB - userA;
    });

    function calculateTotalScore(user: User): number {
      return user.stats.total.correctAnswered;
    }

    return sortedUsers.slice(0, 10) as Array<User>;
  }

  /**
   * Serializes all objects to storage file
   */
  save(): void | any {
    const jsonData = JSON.stringify(this.objects);
    try {
      writeFileSync(this.filePath, jsonData, "utf-8");
    } catch (error) {
      return error
    }
  }

  /**
   * Deserializes objects in file storage
   */
  reload(): void {
    const data: Record<string, any> = {};
    try {
      const parsedData: Record<string, Record<string, any>> = JSON.parse(
        readFileSync(this.filePath, "utf-8")
      );

      // recreate Question models
      for (const parsedKey in parsedData) {
        const parsedObj = parsedData[parsedKey];
        if (parsedObj.__class__ === "Question") {
          data[parsedKey] = {};
          for (const key in parsedObj) {
            if (key !== "__class__") {
              const question = new Question(parsedObj[key]);
              data[parsedKey][key] = question;
            } else {
              data[parsedKey][key] = parsedObj[key];
            }
          }
        }
      }

      // recreate User models
      data.Users = {};
      for (const key in parsedData.Users as Record<
        string,
        Record<string, any>
      >) {
        const model = parsedData.Users[key] as {
          username: string;
          id: string;
          stats: {};
        };
        const user = new User(model.username, model.id, model.stats);

        data.Users[key] = user
      }
    } catch (error) {}
    Object.assign(this.objects, data);
  }

  /**
   * Clears objects in memory. For testing purposes only!
   * @date 06/09/2023 - 13:28:43
   */
  clearMemory(): void {
    this.objects = {};
  }
}

export default FileStorage;
