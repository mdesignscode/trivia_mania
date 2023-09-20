#!/usr/bin/node
import { randomUUID } from "crypto";
import { IQuestion } from "./models/interfaces";
import Question from "./models/question";
import storage from "./models";

main();

const questionsList: Array<IQuestion> = [];

async function fetchTheTriviaAPI() {
  const url = "https://the-trivia-api.com/v2/questions?limit=50";

  const req = await fetch(url);
  const res = await req.json();

  const sanitizedQuestions = res.map((question: Record<string, any>) => {
    const answers = question.incorrectAnswers.concat(question.correctAnswer);
    const newQuestion = {
      answers,
      question: question.question.text,
      id: question.id,
      difficulty: question.difficulty,
      category: question.category,
      correctAnswer: question.correctAnswer,
    };

    return newQuestion;
  });

  questionsList.push(...sanitizedQuestions);
}

async function fetchOpenTriviaDB(url: string) {
  const req = await fetch(url);
  const res = await req.json();

  const sanitizedQuestions = res.results.map(
    (question: Record<string, any>) => {
      const answers = question.incorrect_answers.concat(
        question.correct_answer
      );
      const newQuestion = {
        answers,
        question: question.question,
        id: randomUUID(),
        difficulty: question.difficulty,
        category: question.category,
        correctAnswer: question.correct_answer,
      };

      return newQuestion;
    }
  );

  questionsList.push(...sanitizedQuestions);
}

async function main() {
  for (let i = 0; i < 20; i++) {
    await fetchOpenTriviaDB(
      "https://opentdb.com/api.php?amount=50&type=multiple"
    );
    await fetchTheTriviaAPI();
  }

  const noDuplicates = removeDuplicateQuestions(questionsList);

  noDuplicates.forEach((question: IQuestion) => {
    const questionObj = new Question(question)
    storage.newQuestion(questionObj)
  })
  storage.save()

  console.log('Storage populated 💾🚀');

}

function removeDuplicateQuestions(
  questions: Array<IQuestion>
): Array<IQuestion> {
  const uniqueQuestions: Record<string, any> = {};
  const result = [];

  for (const questionObj of questions) {
    const question = questionObj.question;

    // Check if the question has already been encountered
    if (!uniqueQuestions[question]) {
      // If not, add it to the uniqueQuestions object and the result array
      uniqueQuestions[question] = true;
      result.push(questionObj);
    }
  }

  return result;
}
