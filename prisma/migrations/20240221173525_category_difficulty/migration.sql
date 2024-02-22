/*
  Warnings:

  - Added the required column `category` to the `CategoryStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `DifficulyStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryStat" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DifficulyStat" ADD COLUMN     "difficulty" TEXT NOT NULL;
