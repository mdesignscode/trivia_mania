/* Handles the storing and retrieving Questions */
import { TDifficulties } from "../../../models/customRequests";
import Question from "../../question";
import UserStorage from "./user";
import { QuestionsRecord } from "./baseModel";

interface IPlayFilters {
  difficulty?: string,
  categories?: string[]
}

export default class QuestionStorage extends UserStorage {
  /**
   * Adds a question or a list of questions to storage
   * @date 05/09/2023 - 20:36:02
   *
   * @param {Question} questions - the questions to be added
   */
  newQuestion(questions: Question | Array<Question>): void {
    const difficulties = this.objects.Questions.difficulties
    const categories = this.objects.Questions.categories

    if (Array.isArray(questions)) {
      questions.forEach((question) => {
        storeQuestion(question)
      });
    } else {
      storeQuestion(questions)
    }

    function storeQuestion(obj: Question) {
      // category entry
      if (!categories[obj.category])
        categories[obj.category] = {
          [obj.id]: obj,
        };
      else categories[obj.category][obj.id] = obj;

      // difficulty entry
      if (!difficulties[obj.difficulty])
        difficulties[obj.difficulty] = {
          [obj.id]: obj,
        };
      else difficulties[obj.difficulty][obj.id] = obj;
    }
  }

  /**
   * Retrieves all questions by filter
   * @date 29/09/2023 - 15:12:44
   *
   * @param {("categories" | "difficulties")} recordType
   * @param {string} filter
   * @param {string} [userId=""] - retrieves questions unique to a user
   * @returns {Record<string, Question>}
   */
  getQuestionsByFilter(
    recordType: "categories" | "difficulties",
    filter: string,
    userId: string = ""
  ): Record<string, Question> {
    const filteredQuestions = this.objects.Questions[recordType][filter];
    let uniqueQuestions: Record<string, Question> = {};
    const user = this.getUser(userId)

    if (user) {
      const { answeredQuestions } = user;

      for (const key in filteredQuestions) {
        if (!answeredQuestions.includes(key)) {
          uniqueQuestions[key] = filteredQuestions[key];
        }
      }
    }

    return user ? uniqueQuestions : filteredQuestions;
  }

  /**
   * Retrieve a question of a specific filter from storage
   * @date 05/09/2023 - 20:51:30
   *
   * @param {("categories" | "difficulties")} recordType
   * @param {string} filter - Either `difficulty name` or `category name`
   * @param {string} id - the id of the question
   * @returns {Question}
   */
  getQuestion(
    recordType: "categories" | "difficulties", filter: string, id: string): Question {
    return this.objects.Questions[recordType][filter][id];
  }

  /**
   * Retrieves all questions in storage
   * @date 29/09/2023 - 12:38:53
   *
   * @param {boolean} [singleRecord=false] - if true, retrieves a unique set of questions
   * @param {string} [userId=""] - retrieves questions unique to a user
   * @returns {(Record<string, Question> | QuestionsRecord)}
   */
  getAllQuestions(
    singleRecord: boolean = false,
    userId: string = ""
  ): Record<string, Record<string, Question>> | QuestionsRecord {
    const allQuestions: Record<string, Record<string, Question>> = {};
    const uniqueQuestions: Record<string, Question> = {};
    const user = this.getUser(userId)

    const storageQuestions = this.objects.Questions;

    // difficulties or categories
    for (const recordType in storageQuestions) {
      const filterRecord = storageQuestions[recordType as "difficulties" | "categories"]

      // easy, hard, Science, TV, etc.
      for (const filter in filterRecord) {
        // question
        for (const question in filterRecord[filter]) {
          const questionObj = filterRecord[filter][question];
          if (user && user.answeredQuestions.includes(questionObj.id)) {
            // skip if user answered question
            continue;
          }
          if (!allQuestions[filter]) {
            allQuestions[filter] = {};
          }
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
   * @param {IPlayFilters} filters
   * @param {string} userId - optionally returns a list of questions unique to a user
   * @returns {Array<Question>}
   */
  filterQuestions(filters: IPlayFilters, userId: string = ""): Array<Question> {
    const questions = this.getAllQuestions(true, userId);
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

    return filteredQuestions;
  }

  /**
   * counts all difficulties
   * @date 19/10/2023 - 20:14:04
   *
   * @param {'difficulties'} recordType
   * @param {?string} [userId]
   * @returns {Record<string, number>}
   */
  questionsStats(recordType: 'difficulties', userId?: string): Record<string, number>;

  /**
   * counts all categories based on a difficulty
   * @date 02/11/2023 - 10:34:57
   *
   * @param {'categories'} recordType
   * @param {TDifficulties} difficulty
   * @param {?string} [userId]
   * @returns {Record<string, number>}
   */
  questionsStats(recordType: 'categories', difficulty: TDifficulties, userId?: string): Record<string, number>;

  questionsStats(recordType: 'difficulties' | 'categories', difficulty?: TDifficulties, userId?: string): Record<string, number> {
    const stats: Record<string, number> = {};
    const id = recordType === "categories" ? userId : difficulty
    const user = this.getUser(id || "")

    if (recordType === "difficulties") {
      const difficultiesRecord = this.objects.Questions.difficulties
      let questionsLength = 0;

      for (const difficulty in difficultiesRecord) {
        const difficulyRecord = user
          ? Object.values(difficultiesRecord[difficulty]).filter(question => !user.answeredQuestions.includes(question.id))
          : difficultiesRecord[difficulty]
        const difficultyLength = Object.keys(difficulyRecord).length

        stats[difficulty] = difficultyLength
        questionsLength += difficultyLength
      }

      stats["all difficulties"] = questionsLength
    } else {
      const allQuestions = this.objects.Questions.categories
      let questionsLength = 0;

      Object.values(allQuestions).forEach(difficultyRecord => {
        Object.values(difficultyRecord).forEach(question => {
          if ((difficulty && question.difficulty !== difficulty) || (user && user.answeredQuestions.includes(question.id))) {
            return
          }
          if (!stats[question.category]) {
            stats[question.category] = 1
          } else {
            stats[question.category]++
          }
          questionsLength++
        })
        stats["all categories"] = questionsLength
      });
    }

    return stats;
  }
}
