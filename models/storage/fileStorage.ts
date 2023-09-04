#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { IQuestion } from '../interfaces';

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
   * Adds an object to storage
   * @param obj the object to be added to storage
   */
  new(obj: Record<string, any>): void {
    this.objects[`${obj.constructor.name}.${obj.id}`] = { ...obj, __class__: obj.constructor.name };
  }

  /**
   * Returns all objects of type `Constructor` or all objects in storage
   * @param cls the name of the class to retrieve objects from
   * @returns {{}} all objects in storage
   */
  all(cls?: { name: string }): Record<string, any> {
    const objects: Record<string, any> = {};
    if (!cls)
      Object.assign(objects, this.objects);
    else {
      Object.keys(this.objects).forEach((obj) => {
        if (this.objects[obj].__class__ === cls.name)
          objects[obj] = this.objects[obj];
      });
    }
    return objects;
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
   * Removes an object from storage
   * @param obj the object to be destroyed
   */
  delete(obj: Record<string, any>): void {
    delete this.objects[`${obj.constructor.name}.${obj.id}`];
    this.save();
  }

  /**
   * Retrieves an object from a class
   * @param {constructor} cls the cls to retrieve the object from
   * @param {string} id the object's id
   * @returns the object based on the `cls` and `id`
   */
  get(cls: { name: string }, id: string): Record<string, any> {
    const all = this.all(cls);
    return all[`${cls.name}.${id}`];
  }

  /**
   * Returns a list of filtered questions based on provided filters
   * @date 04/09/2023 - 13:11:21
   *
   * @param {IFilters} filters
   * @returns {Array<IQuestion>}
   */
  filterQuestions(filters: IFilters): Array<IQuestion> {
    const questions: Record<string, IQuestion> = this.all({ name: 'Question' });
    const filteredCategories: Array<IQuestion> = filters.categories
      ? Object.values(questions).filter((question) => filters.categories?.includes(question.category))
      : Object.values(questions).map((question) => question)
    const filteredQuestions = filters.difficulty
      ? filteredCategories.filter(question => question.difficulty === filters.difficulty)
      : filteredCategories

    return filteredQuestions
  }
}

export default FileStorage;
