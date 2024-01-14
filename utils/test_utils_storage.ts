import QuestionStorage from "@/models/storage/fileStorage/question";
import UserStorage from "@/models/storage/fileStorage/user";
import User from "@/models/user";

export function storageHelpers(storage: UserStorage | QuestionStorage) {
  return {
    createMockUser: () => {
      const mockUser = new User("mock user", "mockId")
      storage.newUser(mockUser)
    },
    setMockUserAttribute: (attribute: string, value: any) => {
      // create mock user to update attribute
      const mockUser = storage.getUser("mockId") as User
      Object.assign(mockUser, { [attribute]: value })
      storage.newUser(mockUser)
    }
  }
}
