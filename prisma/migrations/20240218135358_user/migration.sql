-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userStatsId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "answeredQuestions" TEXT[],
    "statsTotalId" INTEGER NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsTotal" (
    "id" SERIAL NOT NULL,
    "answered" INTEGER NOT NULL,
    "correctAnswered" INTEGER NOT NULL,

    CONSTRAINT "StatsTotal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DifficulyStat" (
    "id" SERIAL NOT NULL,
    "answered" INTEGER NOT NULL,
    "correctAnswered" INTEGER NOT NULL,
    "userStatsId" INTEGER,
    "categoryStatId" INTEGER,

    CONSTRAINT "DifficulyStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryStat" (
    "id" SERIAL NOT NULL,
    "userStatsId" INTEGER,

    CONSTRAINT "CategoryStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_statsTotalId_fkey" FOREIGN KEY ("statsTotalId") REFERENCES "StatsTotal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DifficulyStat" ADD CONSTRAINT "DifficulyStat_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DifficulyStat" ADD CONSTRAINT "DifficulyStat_categoryStatId_fkey" FOREIGN KEY ("categoryStatId") REFERENCES "CategoryStat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryStat" ADD CONSTRAINT "CategoryStat_userStatsId_fkey" FOREIGN KEY ("userStatsId") REFERENCES "UserStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
