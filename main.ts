import storage from "./models";
import User from "./models/user";

const mike = new User("mike", "")
const joe = new User("joe", "")
const mack = new User("mack", "")

storage.newUser(mike)
storage.newUser(joe)
storage.newUser(mack)

const testStat = {
  total: {
    answered: 15,
    correctAnswered: 10
  }
}
const testStat2 = {
  total: {
    answered: 20,
    correctAnswered: 15
  }
}
const testStat3 = {
  total: {
    answered: 12,
    correctAnswered: 8
  }
}

mike.stats = testStat
joe.stats = testStat2
mack.stats = testStat3

storage.getTopTenUsers()