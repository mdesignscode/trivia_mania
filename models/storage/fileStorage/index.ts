#!/usr/bin/env node
/* Provides abstraction to application */

import QuestionStorage from "./question";

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
