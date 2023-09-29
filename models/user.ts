#!/usr/bin/node

import { randomUUID } from "crypto";
import {
  CategoryStat,
  DifficultyStat,
  IUser,
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
class User implements IUser {
  username;
  stats;
  id: string;
  avatar;
  answeredQuestions: string[];

  /**
   * Creates an instance of User.
   * @date 29/09/2023 - 12:47:06
   *
   * @constructor
   * @param {string} username
   * @param {string} [id=""]
   * @param {IUserStats} [stats=initialStat]
   * @param {string} [avatar="/avatar.png"]
   * @param {string[]} [answeredQuestions=[]] - question id's a user answered
   */
  constructor(
    username: string,
    id: string = "",
    stats: IUserStats = initialStat,
    avatar: string = "/avatar.png",
    answeredQuestions: string[] = []
  ) {
    this.username = username;
    this.stats = stats;
    this.id = id || randomUUID();
    this.avatar = avatar;
    this.answeredQuestions = answeredQuestions
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
              // set new category difficulty stat
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

  /**
   * adds a list of question id's to user answered questions
   * @date 29/09/2023 - 12:51:45
   *
   * @param {string[]} questions - question id's the user answered
   */
  addAnsweredQuestions(questions: string[]) {
    this.answeredQuestions = [...this.answeredQuestions, ...questions]
  }
}

export default User;
