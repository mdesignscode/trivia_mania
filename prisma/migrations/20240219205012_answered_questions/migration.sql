/*
  Warnings:

  - You are about to drop the column `answeredQuestions` on the `UserStats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userStatsId_fkey";

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "answeredQuestions";

-- CreateTable
CREATE TABLE "AnsweredQuestion" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "userStatsId" INTEGER,

    CONSTRAINT "AnsweredQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
