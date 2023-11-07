import { IUser } from "../../interfaces";
import Question from "../../question";
import User from "../../user";
import { readFileSync, writeFileSync } from "fs";

export type QuestionsRecord = { [key: string]: Question };

type TQuestionsRecord = {
  difficulties: Record<string, QuestionsRecord>
  categories: Record<string, QuestionsRecord>
};

export interface IStorageObjects {
  Questions: TQuestionsRecord;
  Users: Record<string, User>;
}
const defaultQuestions: TQuestionsRecord = {
  difficulties: {},
  categories: {}
};

export class BaseModel {
  protected filePath: string = "file.json";
  protected objects: IStorageObjects = {
    Questions: defaultQuestions,
    Users: {},
  };

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
      Questions: defaultQuestions
    };

    try {
      const parsedData: IStorageObjects = JSON.parse(
        readFileSync(this.filePath, "utf-8")
      );
      const questionCreator = reCreateQuestions(parsedData)

      // recreate Question models
      for (const questionsFilter in parsedData.Questions) {
        // difficulties or categories
        const filter = questionsFilter as "difficulties" | "categories"

        // handle difficulties
        if (filter === "difficulties") {
          questionCreator("difficulties")
        } else {
          questionCreator("categories")
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
    } catch (error) { }
    this.objects = data

    function reCreateQuestions(parsedData: IStorageObjects) {
      return (recordType: "difficulties" | "categories") => {
        const queryRecord = parsedData.Questions[recordType]
        // easy, medium, Science, Maths, etc.
        for (const queryKey in queryRecord) {
          data.Questions[recordType][queryKey] = {}

          // the questions
          for (const questionId in queryRecord[queryKey]) {
            data.Questions[recordType][queryKey][questionId] = new Question(queryRecord[queryKey][questionId])
          }
        }
      }
    }
  }

  /**
   * Clears objects in memory. For testing purposes only!
   * @date 06/09/2023 - 13:28:43
   */
  clearMemory(): void {
    this.objects = {
      Questions: defaultQuestions,
      Users: {},
    };
  }
}
