#!/usr/bin/node

type UserStats = Record<string, Record<string, number>>

/**
 * A class for a trivia mania player
 * @date 09/09/2023 - 23:43:08
 *
 * @class User
 * @typedef {User}
 */
class User {
  username;
  private password;
  private stats: UserStats;
  
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
    this.password = password;
    this.stats = {}
  }

  /**
   * Description placeholder
   * @date 09/09/2023 - 23:48:12
   *
   * @returns {Record<string, any>}
   */
  getUserStats(): UserStats {
    return {}
  }

  /**
   * Uploads a user's progress on one round
   * @date 11/09/2023 - 00:39:41
   *
   * @param {UserStats} stats - User's progress
   */
  submitRound(stats: UserStats) {}
}

export default User;
