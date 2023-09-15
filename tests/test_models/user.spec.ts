const crypto = require("crypto");
import User from "../../models/user";
import { stub } from 'sinon'

describe("User class", function () {
  test("It should create a new user with getters and setters for `stats`", function () {
    const mike = new User("mike23")

    const testStat = {
      easy: {
        answered: 15,
        correctAnswered: 10
      },
      Science: {
        easy: {
          answered: 10,
          correctAnswered: 7
        }
      },
      History: {
        easy: {
          answered: 5,
          correctAnswered: 3
        }
      },
      total: {
        answered: 15,
        correctAnswered: 10
      }
    }
    
    const initialStats = mike.stats
    expect(initialStats).toEqual({})

    mike.stats = testStat

    const mikeStats = mike.stats
    expect(mikeStats).toEqual(testStat)

    const testStat2 = {
      easy: {
        answered: 5,
        correctAnswered: 5
      },
      Science: {
        easy: {
          answered: 5,
          correctAnswered: 5
        }
      },
      total: {
        answered: 5,
        correctAnswered: 5
      }
    } 
    mike.stats = testStat2

    const testStatResults = {
      easy: {
        answered: 20,
        correctAnswered: 15
      },
      Science: {
        easy: {
          answered: 15,
          correctAnswered: 12
        }
      },
      History: {
        easy: {
          answered: 5,
          correctAnswered: 3
        }
      },
      total: {
        answered: 20,
        correctAnswered: 15
      }
    }
    expect(mikeStats).toEqual(testStatResults)
  });

  test("Should initialize a user with a random UUID", function () {
    const UUIDstub = stub(crypto, "randomUUID")
    const mockUUID = "4043063d-fcae-41a4-9855-ea0b0fb95690"
    UUIDstub.callsFake(() => mockUUID)
    const mike = new User("mike")
    const mikeId = mike.id

    expect(mikeId).toStrictEqual(mockUUID)
  })
});
