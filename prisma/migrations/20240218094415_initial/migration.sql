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

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");
