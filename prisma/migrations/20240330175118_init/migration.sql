-- CreateTable
CREATE TABLE "Question" (
    "category" TEXT NOT NULL,
    "answers" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "answeredQuestions" INTEGER[],
    "correctAnswered" INTEGER NOT NULL,
    "easyStatId" INTEGER NOT NULL,
    "mediumStatId" INTEGER NOT NULL,
    "hardStatId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasyStat" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "EasyStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediumStat" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MediumStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardStat" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "HardStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryStat" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "easyId" INTEGER,
    "easyAnswered" INTEGER,
    "easyCorrect" INTEGER,
    "mediumId" INTEGER,
    "mediumAnswered" INTEGER,
    "mediumCorrect" INTEGER,
    "hardId" INTEGER,
    "hardAnswered" INTEGER,
    "hardCorrect" INTEGER,

    CONSTRAINT "CategoryStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_easyStatId_fkey" FOREIGN KEY ("easyStatId") REFERENCES "EasyStat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mediumStatId_fkey" FOREIGN KEY ("mediumStatId") REFERENCES "MediumStat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hardStatId_fkey" FOREIGN KEY ("hardStatId") REFERENCES "HardStat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
