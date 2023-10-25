import { writeFileSync } from 'fs';
import storage from './models';
import User from './models/user';

beforeEach(() => {
  // clear memory
  storage.clearMemory()

  // clear file storage
  writeFileSync("file.json", JSON.stringify("{}"));

  // create a new user
  const mockUser = new User("mock user", "mockId")
  storage.newUser(mockUser)
});
