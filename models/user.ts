#!/usr/bin/node

import { randomUUID } from "crypto";

type UserStats = Record<string, Record<string, any>>;

/**
 * A class for a trivia mania player
 * @date 09/09/2023 - 23:43:08
 *
 * @class User
 * @typedef {User}
 */
class User {
  username;
  stats;
  id: string;
  avatar;

  /**
   * Creates an instance of User.
   * @date 15/09/2023 - 16:14:11
   *
   * @constructor
   * @param {string} username
   * @param {string} [id=randomUUID()]
   * @param {UserStats} [stats={}]
   * @param {string} [avatar="/avatar.png"]
   */
  constructor(
    username: string,
    id: string = randomUUID(),
    stats: UserStats = {},
    avatar: string = "/avatar.png"
  ) {
    this.username = username;
    this.stats = stats;
    this.id = id;
    this.avatar = avatar
  }

  /**
   * Uploads a user's stats on a round
   * @date 15/09/2023 - 15:05:00
   *
   * @param {UserStats} stats - The user's results from one round
   */
  submitRound(stats: UserStats) {
    const userStats = this.stats;

    interface IStat {
      answered: number;
      correctAnswered: number;
    }

    for (const key in stats) {
      if (["easy", "medium", "hard", "total"].includes(key)) {
        if (userStats[key]) {
          const stat = stats[key] as IStat;
          const userStat = userStats[key] as IStat;
          userStat.answered += stat.answered;
          userStat.correctAnswered += stat.correctAnswered;
        } else userStats[key] = stats[key];
      } else {
        if (userStats[key]) {
          for (const subKey in stats[key] as Record<string, IStat>) {
            if (userStats[key][subKey]) {
              const stat = stats[key][subKey] as IStat;
              const userStat = userStats[key][subKey] as IStat;
              userStat.answered += stat.answered;
              userStat.correctAnswered += stat.correctAnswered;
            } else userStats[key][subKey] = stats[key][subKey];
          }
        } else userStats[key] = stats[key];
      }
    }
  }
}

export default User;
