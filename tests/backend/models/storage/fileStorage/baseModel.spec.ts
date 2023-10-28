// Unit tests for FileStorage class

import storage from "@/models/index";
import Question from "@/models/question";
import FileStorage, {
  IStorageObjects
} from "@/models/storage/fileStorage";
import { BaseModel } from "@/models/storage/fileStorage/baseModel";
import User from "@/models/user";
import { generateFakeData } from "@/utils/test_utils_api";
import { readFileSync, unlinkSync, writeFileSync } from "fs";

describe("BaseModel class", function () {
  describe("save method", function () {
    test("Serializes objects to file storage", function () {
      const { Question1 } = generateFakeData();
      storage.newQuestion(Question1);
      storage.save();

      const data: IStorageObjects = JSON.parse(
        readFileSync("file.json", "utf-8")
      );
      const easyQuestion = data.Questions.easy["1"];
      expect(easyQuestion).toBeDefined();
      const mockUser = data.Users.mockId;
      expect(mockUser).toBeDefined();

      writeFileSync("file.json", JSON.stringify({}));
    });
  });

  describe("reload method", function () {
    test("Deserializes objects to memory", function () {
      const { Question2 } = generateFakeData();

      storage.newQuestion(Question2);
      storage.save();

      storage.reload();

      const mediumQuestion = storage.getQuestion("medium", "2");
      expect(mediumQuestion).toBeDefined();

      const mockUser = storage.getUser("mockId");
      expect(mockUser).toBeDefined();
    });

    test("Should create an empty object in memory if file doesn't exist", function () {
      try {
        unlinkSync("file.json");
      } catch (err) {}
      storage.reload();
      const allQuestions = storage.getAllQuestions();
      expect(Object.keys(allQuestions).length).toStrictEqual(0);
    });

    test("Should deserialize objects back to their original class", function () {
      const { Question2 } = generateFakeData();
      const mike = new User("mike");

      storage.newUser(mike);
      storage.newQuestion(Question2);
      storage.save();

      storage.reload();

      const mediumQuestion = storage.getQuestion("medium", "2");
      const mikeUser = storage.getUser(mike.id);

      expect(mediumQuestion).toBeInstanceOf(Question);
      expect(mikeUser).toBeInstanceOf(User);
    });
  });
});
