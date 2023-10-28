#!/usr/bin/env node
/* Provides abstraction to application */

import Question from "../../question";
import User from "../../user";
import QuestionStorage from "./question";

export type QuestionsRecord = Record<string, Record<string, Question>>;
export interface IStorageObjects {
  Questions: QuestionsRecord;
  Users: Record<string, User>;
}

/**
 * Storage engine for storing objects in file storage
 * @date 16/10/2023 - 21:20:12
 *
 * @class FileStorage
 * @type {FileStorage}
 * @extends {QuestionStorage}
 */
class FileStorage extends QuestionStorage {

}

export default FileStorage;
