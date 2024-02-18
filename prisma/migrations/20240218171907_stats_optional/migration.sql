-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userStatsId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userStatsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
