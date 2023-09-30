#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import Question from "../question";
import User from "../user";
import { IQuestion, IUser, IUserStats } from "../interfaces";

interface IFilters {
  difficulty?: string;
  categories?: Array<string>;
}

export type QuestionsRecord = Record<string, Record<string, Question>>;
type SerializedQuestionsRecord = Record<string, Record<string, IQuestion>>;

export interface IStorageObjects {
  Questions: QuestionsRecord;
  Users: Record<string, User>;
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
  private objects: IStorageObjects = {
    Questions: {},
    Users: {},
  };

  /**
   * Adds a question or a list of questions to storage
   * @date 05/09/2023 - 20:36:02
   *
   * @param {Question} questions - the questions to be added
   */
  newQuestion(questions: Question | Array<Question>): void {
    if (Array.isArray(questions)) {
      questions.forEach((obj) => {
        // category entry
        if (!this.objects.Questions[obj.category])
          this.objects.Questions[obj.category] = {
            [obj.id]: obj,
          };
        else this.objects.Questions[obj.category][obj.id] = obj;

        // difficulty entry
        if (!this.objects.Questions[obj.difficulty])
          this.objects.Questions[obj.difficulty] = {
            [obj.id]: obj,
          };
        else this.objects.Questions[obj.difficulty][obj.id] = obj;
      });
    } else {
      const obj = questions;
      // category entry
      if (!this.objects.Questions[obj.category])
        this.objects.Questions[obj.category] = {
          [obj.id]: obj,
        };
      else this.objects.Questions[obj.category][obj.id] = obj;

      // difficulty entry
      if (!this.objects.Questions[obj.difficulty])
        this.objects.Questions[obj.difficulty] = {
          [obj.id]: obj,
        };
      else this.objects.Questions[obj.difficulty][obj.id] = obj;
    }
  }

  /**
   * Retrieves all questions by filter
   * @date 29/09/2023 - 15:12:44
   *
   * @param {string} filter
   * @param {string} [userId=""] - filters out questions a user hasn't answered yet
   * @returns {Record<string, Question>}
   */
  getQuestionsByFilter(
    filter: string,
    userId: string = ""
  ): Record<string, Question> {
    const filteredQuestions = this.objects.Questions[filter];
    let uniqueQuestions: Record<string, Question> = {};
    const user = this.getUser(userId);

    if (user) {
      const userAnswered = user.answeredQuestions;
      for (const key in filteredQuestions) {
        if (!userAnswered.includes(key)) {
          uniqueQuestions[key] = filteredQuestions[key];
        }
      }
    }

    return userId ? uniqueQuestions : filteredQuestions;
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
    return this.objects.Questions[filter][id];
  }

  /**
   * Retrieves all questions in storage
   * @date 29/09/2023 - 12:38:53
   *
   * @param {boolean} [singleRecord=false] - if true, retrieves a unique set of questions
   * @param {string} [userId=""] - retrieves only questions a user hasn't answered yet
   * @returns {(Record<string, Question> | QuestionsRecord)}
   */
  getAllQuestions(
    singleRecord: boolean = false,
    userId: string = ""
  ): Record<string, Question> | QuestionsRecord {
    const allQuestions: QuestionsRecord = {};
    const uniqueQuestions: Record<string, Question> = {};
    const user = this.getUser(userId);

    const storageQuestions = this.objects.Questions;
    for (const filter in storageQuestions) {
      allQuestions[filter] = {};
      for (const question in storageQuestions[filter]) {
        const questionObj = storageQuestions[filter][question];
        if (user && !user.answeredQuestions.includes(questionObj.id)) {
          uniqueQuestions[question] = questionObj;
          allQuestions[filter][questionObj.id] = questionObj;
        } else if (!userId) {
          uniqueQuestions[question] = questionObj;
          allQuestions[filter][questionObj.id] = questionObj;
        }
      }
    }

    return singleRecord ? uniqueQuestions : allQuestions;
  }

  /**
   * Returns a list of filtered questions based on provided filters
   * @date 04/09/2023 - 13:11:21
   *
   * @param {IFilters} filters
   * @returns {Array<Question>}
   */
  filterQuestions(filters: IFilters): Array<Question> {
    const questions = this.getAllQuestions(true);
    const filteredCategories: Array<Question> = filters.categories?.length
      ? Object.values(questions).filter((question) =>
          filters.categories?.includes(question.category)
        )
      : Object.values(questions).map((question) => question);
    const filteredQuestions = filters.difficulty
      ? filteredCategories.filter(
          (question) => question.difficulty === filters.difficulty
        )
      : filteredCategories;

    // shuffle questions
    function shuffleArray(array: Array<Question>): Array<Question> {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    }

    return shuffleArray(filteredQuestions);
  }

  /**
   * counts all question filters, or counts all categories by difficulty
   * @date 29/09/2023 - 15:05:49
   *
   * @param {string} [difficulty=""]
   * @param {string} [userId=""] - optionally counts filters user has not answered
   * @returns {Record<string, number>}
   */
  questionsStats(
    difficulty: string = "",
    userId: string = ""
  ): Record<string, number> {
    const stats: Record<string, number> = {};
    let uniqueQuestions: Record<string, Question>;

    uniqueQuestions = difficulty
      ? this.getQuestionsByFilter(difficulty, userId)
      : (this.getAllQuestions(true, userId) as Record<string, Question>);

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
      const allQuestions = this.getAllQuestions(false, userId);
      for (const key in allQuestions) {
        stats[key] = Object.keys(allQuestions[key]).length;
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
    if (Array.isArray(user)) {
      const users = user as Array<User>;

      users.forEach((user) => (this.objects.Users[user.id] = user));
    } else {
      const NewUser = user as User;
      this.objects.Users[NewUser.id] = user;
    }
  }

  /**
   * deletes a user from storage
   * @date 15/09/2023 - 13:36:47
   *
   * @param {string} id
   */
  deleteUser(id: string) {
    const users = this.objects.Users;

    if (users && users[id]) delete users[id];
  }

  /**
   * Retrieves a user
   * @date 11/09/2023 - 00:45:12
   *
   * @param {string} id - the user's id
   * @returns {User | null}
   */
  getUser(id: string): User | null {
    return this.objects.Users[id] || null;
  }

  /**
   * Saves a user's progress on a round
   * @date 11/09/2023 - 16:12:07
   *
   * @param {string} id - the user's id
   * @param {UserStats} stats
   */

  /**
   * Saves a user's progress on a round
   * @date 11/09/2023 - 16:12:07
   *
   * @param {string} id - the user's id
   * @param {IUserStats} stats - new stats to be added
   * @param {string[]} questionsAnswered - list of answered questions
   */
  updateUserProgress(id: string, stats: IUserStats, questionsAnswered: string[]) {
    const user = this.getUser(id);
    if (user) {
      user.submitRound(stats, questionsAnswered);
      this.save();
    }
  }

  /**
   * Retrieves a user's progress
   * @date 11/09/2023 - 00:51:09
   *
   * @param {string} id - the user's id
   * @returns {UserStats | undefined}
   */
  getUserStats(id: string): IUserStats | undefined {
    const user = this.getUser(id);
    if (user) {
      return user.stats;
    }
  }

  /**
   * Retrieves all users in storage
   * @date 11/09/2023 - 17:51:09
   *
   * @returns {Record<string, User>}
   */
  getAllUsers(): Record<string, User> {
    return this.objects.Users;
  }

  /**
   * Retrieves top ten scoring users
   * @date 11/09/2023 - 00:54:37
   *
   * @returns {Array<User>}
   */
  getTopTenUsers(): Array<User> {
    const usersList = Object.values(this.objects.Users) as Array<User>;
    const users = usersList.filter(
      (user) => Object.keys(user.stats).length > 0
    );
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
      return error;
    }
  }

  /**
   * Deserializes objects in file storage
   */
  reload(): void {
    const data: IStorageObjects = {
      Users: {},
      Questions:{}
    };
    try {
      const parsedData: Record<string, Record<string, any>> = JSON.parse(
        readFileSync(this.filePath, "utf-8")
      );

      // recreate Question models
      for (const parsedKey in parsedData.Questions as SerializedQuestionsRecord) {
        const parsedObj = parsedData.Questions[parsedKey] as Record<string, IQuestion>
        data.Questions[parsedKey] = {}
        for (const key in parsedObj) {
          const model = new Question(parsedObj[key]);
          data.Questions[parsedKey][key] = model
        }
      }

      // recreate User models
      data.Users = {};
      for (const key in parsedData.Users as Record<string, IUser>) {
        const model = parsedData.Users[key] as IUser;
        const user = new User(
          model.username,
          model.id,
          model.stats,
          model.avatar,
          model.answeredQuestions
        );

        data.Users[key] = user;
      }
    } catch (error) {}
    Object.assign(this.objects, data);
  }

  /**
   * Clears objects in memory. For testing purposes only!
   * @date 06/09/2023 - 13:28:43
   */
  clearMemory(): void {
    this.objects = {
      Questions: {},
      Users: {},
    };
  }
}

export default FileStorage;
