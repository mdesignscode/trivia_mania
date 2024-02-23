/*
  Warnings:

  - You are about to drop the `AnsweredQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnsweredQuestion" DROP CONSTRAINT "AnsweredQuestion_userId_fkey";

-- DropForeignKey
ALTER TABLE "AnsweredQuestion" DROP CONSTRAINT "AnsweredQuestion_userStatsId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "answeredQuestions" INTEGER[];

-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "answeredQuestions" INTEGER[];

-- DropTable
DROP TABLE "AnsweredQuestion";
