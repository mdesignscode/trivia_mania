import FileStorage from "@/models/storage/fileStorage";
import { BaseModel } from "@/models/storage/fileStorage/baseModel";
import QuestionStorage from "@/models/storage/fileStorage/question";
import UserStorage from "@/models/storage/fileStorage/user";

describe("FileStorage class", function () {
  it("Inherits from QuestionStorage, UserStorage, BaseModel",() => {
    const storage = new FileStorage();
    expect(storage).toBeInstanceOf(BaseModel)
    expect(storage).toBeInstanceOf(UserStorage)
    expect(storage).toBeInstanceOf(QuestionStorage)
  })
});
