#!/usr/bin/node

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
  private _password;
  private _stats: UserStats;
  
  /**
   * Creates an instance of User.
   * @date 09/09/2023 - 23:43:07
   *
   * @constructor
   * @param {string} username
   * @param {string} password
   */
  constructor(username: string, password: string) {
    this.username = username;
    this._password = password;
    this._stats = {}
  }

  /**
   * Retrieves a user's password
   * @date 11/09/2023 - 19:53:51
   *
   * @readonly
   * @type {string}
   */
  get password(): string {
    return this._password
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
