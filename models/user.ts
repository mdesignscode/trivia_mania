#!/usr/bin/node

import { randomUUID } from "crypto";
import {
  CategoryStat,
  DifficultyStat,
  IUserStats,
  initialStat,
} from "./interfaces";

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
   * @param {string} [id=""]
   * @param {UserStats} [stats={}]
   * @param {string} [avatar="/avatar.png"]
   */
  constructor(
    username: string,
    id: string = "",
    stats: IUserStats = initialStat,
    avatar: string = "/avatar.png"
  ) {
    this.username = username;
    this.stats = stats;
    this.id = id || randomUUID();
    this.avatar = avatar;
  }

  /**
   * Uploads a user's stats on a round
   * @date 15/09/2023 - 15:05:00
   *
   * @param {UserStats} stats - The user's results from one round
   */
  submitRound(stats: IUserStats) {
    const userStats = this.stats;

    for (const key in stats) {
      // difficulty stats
      if (["easy", "medium", "hard", "total"].includes(key)) {
        // increment values if exists
        if (userStats[key]) {
          const stat = stats[key] as DifficultyStat;
          const userStat = userStats[key] as DifficultyStat;
          userStat.answered += stat.answered;
          userStat.correctAnswered += stat.correctAnswered;
        } else {
          // set new difficulty stat
          userStats[key] = stats[key];
        }
      } else {
        // category stats
        if (userStats[key]) {
          // increment values if exists
          for (const subKey in stats[key] as CategoryStat) {
            if ((userStats[key] as CategoryStat)[subKey]) {
              const stat = (stats[key] as CategoryStat)[subKey];
              const userStat = (userStats[key] as CategoryStat)[subKey];
              userStat.answered += stat.answered;
              userStat.correctAnswered += stat.correctAnswered;
            } else {
              // set new category diffculty stat
              (userStats[key] as CategoryStat)[subKey] = (
                stats[key] as CategoryStat
              )[subKey];
            }
          }
        } else {
          // set new category stat
          userStats[key] = stats[key];
        }
      }
    }
  }
}

export default User;
