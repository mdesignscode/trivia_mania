import { IUserStats, initialStat } from "@/models/interfaces";
import User from "@/models/user";

describe("User class", () => {
  let user: User;
  const mockStats: IUserStats = initialStat;

  beforeEach(() => {
    user = new User("testUser", "testId", mockStats, "/testAvatar.png", []);
  });

  it("should create a new user with provided properties", () => {
    expect(user.username).toBe("testUser");
    expect(user.id).toBe("testId");
    expect(user.stats).toEqual(mockStats);
    expect(user.avatar).toBe("/testAvatar.png");
    expect(user.answeredQuestions).toEqual([]);
  });

  it("should create a new user with a random UUID if no id is provided", () => {
    const newUser = new User("testUser");
    expect(newUser.id).not.toBeUndefined();
  });

  it("should submit a round of stats correctly", () => {
    const roundStats: IUserStats = {
      easy: { answered: 5, correctAnswered: 3 },
      medium: { answered: 6, correctAnswered: 4 },
      hard: { answered: 4, correctAnswered: 2 },
      total: { answered: 15, correctAnswered: 9 },
    };

    user.submitRound(roundStats, []);

    expect(user.stats.easy).toEqual({ answered: 5, correctAnswered: 3 });
    expect(user.stats.medium).toEqual({ answered: 6, correctAnswered: 4 });
    expect(user.stats.hard).toEqual({ answered: 4, correctAnswered: 2 });
    expect(user.stats.total).toEqual({ answered: 15, correctAnswered: 9 });
  });

  it("should add answered questions correctly", () => {
    const questionsToAdd = ["question1", "question2", "question3"];

    user.addAnsweredQuestions(questionsToAdd);

    expect(user.answeredQuestions).toEqual(questionsToAdd);
  });
});
