#!/usr/bin/node

import { randomUUID } from "crypto";

type UserStats = Record<string, Record<string, any>>

/**
 * A class for a trivia mania player
 * @date 09/09/2023 - 23:43:08
 *
 * @class User
 * @typedef {User}
 */
class User {
  username;
  private _stats: UserStats;
  id: string;

  /**
   * Creates an instance of User.
   * @date 15/09/2023 - 10:44:58
   *
   * @constructor
   * @param {string} username
   * @param {string} [id=randomUUID()]
   */
  constructor(username: string, id: string = randomUUID()) {
    this.username = username;
    this._stats = {}
    this.id = id
  }

  /**
   * Retrieves a user's stats
   * @date 11/09/2023 - 12:13:29
   *
   * @readonly
   * @type {UserStats}
   */
  get stats(): UserStats {
    return this._stats
  }

  /**
   * Updates a user's stats
   */
  set stats(stats: UserStats) {
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
