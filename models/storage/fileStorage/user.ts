#!/usr/bin/node

/* Handles the storing and retrieving Users  */
import { IUserStats } from "../../interfaces";
import User from "../../user";
import { BaseModel } from "./baseModel";

export default class UserStorage extends BaseModel {
  /**
   * Adds a user or a list of users to storage
   * @date 15/09/2023 - 14:28:56
   *
   * @param {(User | Array<User>)} user
   */
  newUser(user: User | Array<User>) {
    if (Array.isArray(user)) {
      const users = user as Array<User>;

      users.forEach((user) => (this.objects.Users[user.id] = user));
    } else {
      const NewUser = user as User;
      this.objects.Users[NewUser.id] = user;
    }
  }

  /**
   * deletes a user from storage
   * @date 15/09/2023 - 13:36:47
   *
   * @param {string} id
   */
  deleteUser(id: string) {
    const users = this.objects.Users;

    if (users && users[id]) delete users[id];
  }

  /**
   * Retrieves a user
   * @date 11/09/2023 - 00:45:12
   *
   * @param {string} id - the user's id
   * @returns {User | null}
   */
  getUser(id: string): User | null {
    return this.objects.Users[id] || null;
  }

  /**
   * Saves a user's progress on a round
   * @date 11/09/2023 - 16:12:07
   *
   * @param {string} id - the user's id
   * @param {UserStats} stats
   */

  /**
   * Saves a user's progress on a round
   * @date 11/09/2023 - 16:12:07
   *
   * @param {string} id - the user's id
   * @param {IUserStats} stats - new stats to be added
   * @param {string[]} questionsAnswered - list of answered questions
   */
  updateUserProgress(id: string, stats: IUserStats, questionsAnswered: string[]) {
    const user = this.getUser(id);
    if (user) {
      user.submitRound(stats, questionsAnswered);
      this.save()
    }
  }

  /**
   * Retrieves a user's progress
   * @date 11/09/2023 - 00:51:09
   *
   * @param {string} id - the user's id
   * @returns {UserStats | undefined}
   */
  getUserStats(id: string): IUserStats | undefined {
    const user = this.getUser(id);
    if (user) {
      return user.stats;
    }
  }

  /**
   * Retrieves all users in storage
   * @date 11/09/2023 - 17:51:09
   *
   * @returns {Record<string, User>}
   */
  getAllUsers(): Record<string, User> {
    return this.objects.Users;
  }

  /**
   * Retrieves top ten scoring users
   * @date 11/09/2023 - 00:54:37
   *
   * @returns {Array<User>}
   */
  getTopTenUsers(): Array<User> {
    const usersList = Object.values(this.objects.Users) as Array<User>;
    const users = usersList.filter(
      (user) => Object.keys(user.stats).length > 0
    );
    const sortedUsers = users.sort((a, b) => {
      const userA = calculateTotalScore(a as User);
      const userB = calculateTotalScore(b as User);
      return userB - userA;
    });

    function calculateTotalScore(user: User): number {
      return user.stats.total.correctAnswered;
    }

    return sortedUsers.slice(0, 10) as Array<User>;
  }
}
