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
    "answeredQuestions" TEXT[],
    "correctAnswered" INTEGER NOT NULL,
    "totalAnswered" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasyStat" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,

    CONSTRAINT "EasyStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediumStat" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,

    CONSTRAINT "MediumStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardStat" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,

    CONSTRAINT "HardStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryStat" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "easyId" INTEGER NOT NULL,
    "easyAnswered" INTEGER NOT NULL,
    "easyCorrect" INTEGER NOT NULL,
    "mediumId" INTEGER NOT NULL,
    "mediumAnswered" INTEGER NOT NULL,
    "mediumCorrect" INTEGER NOT NULL,
    "hardId" INTEGER NOT NULL,
    "hardAnswered" INTEGER NOT NULL,
    "hardCorrect" INTEGER NOT NULL,

    CONSTRAINT "CategoryStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- AddForeignKey
ALTER TABLE "EasyStat" ADD CONSTRAINT "EasyStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediumStat" ADD CONSTRAINT "MediumStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardStat" ADD CONSTRAINT "HardStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
