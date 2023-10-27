#!/usr/bin/node
import { randomUUID } from "crypto";
import { IQuestion } from "./models/interfaces";
import Question from "./models/question";
import storage from "./models";

const triviaCategories = [
  'Sports',
  'Entertainment: Video Games',
  'Geography',
  'Entertainment: Books',
  'History',
  'Entertainment: Television',
  'Entertainment: Cartoon & Animations',
  'Entertainment: Music',
  'Science & Nature',
  'Celebrities',
  'General Knowledge',
  'Politics',
  'Entertainment: Japanese Anime & Manga',
  'Entertainment: Film',
  'Entertainment: Comics',
  'Vehicles',
  'Mythology',
  'Entertainment: Musicals & Theatres',
  'Science: Mathematics',
  'Science: Computers',
  'Entertainment: Board Games',
  'Art',
  'Science: Gadgets',
  'Animals'
]



main();

const questionsList: Array<IQuestion> = [];

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
  for (let i = 0; i < triviaCategories.length; i++) {
    const baseUrl = "https://opentdb.com/api.php?amount=50&type=multiple"
    const url = baseUrl + "&category=" + i
    await fetchOpenTriviaDB(url);
  }

  const noDuplicates = removeDuplicateQuestions(questionsList);

  noDuplicates.forEach((question: IQuestion) => {
    const questionObj = new Question(question)
    storage.newQuestion(questionObj)
  })
  storage.save()

  console.log('Storage populated with questions💾🚀');

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
