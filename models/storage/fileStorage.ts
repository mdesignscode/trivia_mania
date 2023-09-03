#!/usr/bin/env node
import * as fs from 'fs';

/**
 * File storage engine
 */
class FileStorage {
  private filePath: string = 'file.json';
  private objects: Record<string, any> = {};

  /**
   * Adds an object to storage
   * @param obj the object to be added to storage
   */
  public new(obj: Record<string, any>): void {
    this.objects[`${obj.constructor.name}.${obj.id}`] = { ...obj, __class__: obj.constructor.name };
  }

  /**
   * Returns all objects of type `Constructor` or all objects in storage
   * @param cls the name of the class to retrieve objects from
   * @returns {{}} all objects in storage
   */
  public all(cls?: { name: string }): Record<string, any> {
    const objects: Record<string, any> = {};
    if (!cls)
      Object.assign(objects, this.objects);
    else {
      Object.keys(this.objects).forEach((obj) => {
        if (this.objects[obj].__class__ === cls.name)
          objects[obj] = this.objects[obj];
      });
    }

    for (const obj of Object.values(objects)) {
      delete obj.password;
    }
    return objects;
  }

  /**
   * Serializes all objects to storage file
   */
  public save(): void {
    const jsonData = JSON.stringify(this.objects);
    fs.writeFileSync(this.filePath, jsonData, 'utf-8');
  }

  /**
   * Deserializes objects in file storage
   */
  public reload(): void {
    let data: Record<string, any>;
    try {
      data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    } catch (error) {
      data = {};
    }
    Object.assign(this.objects, data);
  }

  /**
   * Removes an object from storage
   * @param obj the object to be destroyed
   */
  public delete(obj: Record<string, any>): void {
    delete this.objects[`${obj.constructor.name}.${obj.id}`];
    this.save();
  }

  /**
   * Reloads the objects in storage
   */
  public close(): void {
    this.reload();
  }

  /**
   * Updates an object attribute with the given value
   * @param obj the object to be updated
   * @param key the key to be updated
   * @param value the value to update the key with
   */
  public update(obj: Record<string, any>, key: string, value: string): void {
    if (['id', 'created_at', 'updated_at'].includes(key)) return;
    const crypto = require('crypto');
    // create hash object
    const hash = crypto.createHash('sha256');

    // update hash object with the string to be hashed
    hash.update(value);

    this.objects[`${obj.constructor.name}.${obj.id}`][key] = key === 'password' ? hash.digest('hex') : value;
    this.save();
  }

  /**
   * Updates an object in storage with `dictionary`
   * @param obj the object to be updated
   * @param dictionary the object to be assigned
   */
  public updateDict(obj: Record<string, any>, dictionary: Record<string, any>): void {
    Object.keys(dictionary).forEach((key) => {
      if (['id', 'created_at', 'updated_at'].includes(key)) return;
    });
    if (dictionary.password) {
      const crypto = require('crypto');
      // create hash object
      const hash = crypto.createHash('sha256');

      // update hash object with the string to be hashed
      hash.update(dictionary.password);

      // get the hashed value in hexadecimal format
      dictionary.password = hash.digest('hex');
    }
    Object.assign(
      this.objects[`${obj.constructor.name}.${obj.id}`],
      dictionary
    );
    this.save();
  }

  /**
   * Retrieves an object from a class
   * @param cls the cls to retrieve the object from
   * @param id the object's id
   * @returns the object based on the `cls` and `id`
   */
  public get(cls: { name: string }, id: string): Record<string, any> | undefined {
    const all = this.all(cls);
    console.log(`${cls.name}.${id}`);
    console.log(all);

    return all[`${cls.name}.${id}`];
  }

  /**
   * Counts the number of objects in a class or all classes
   * @param cls the class to be counted
   * @returns the number of objects in storage
   */
  public count(cls?: { name: string }): number {
    let count: number;
    if (cls) {
      const all = this.all(cls);
      count = Object.keys(all).length;
    } else {
      const all = this.all();
      count = Object.keys(all).length;
    }

    return count;
  }
}

export default FileStorage;
