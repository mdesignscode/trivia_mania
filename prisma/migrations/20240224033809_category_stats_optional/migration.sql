-- AlterTable
ALTER TABLE "CategoryStat" ALTER COLUMN "easyId" DROP NOT NULL,
ALTER COLUMN "easyAnswered" DROP NOT NULL,
ALTER COLUMN "easyCorrect" DROP NOT NULL,
ALTER COLUMN "mediumId" DROP NOT NULL,
ALTER COLUMN "mediumAnswered" DROP NOT NULL,
ALTER COLUMN "mediumCorrect" DROP NOT NULL;