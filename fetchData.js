#!/usr/bin/node

const { randomUUID } = require("crypto");

const questionsList = []

async function fetchTheTriviaAPI () {
  const url = 'https://the-trivia-api.com/v2/questions?limit=50'

  const req = await fetch(url)
  const res = await req.json()

  const sanitizedQuestions = res.map((question) => {
    const answers = question.incorrectAnswers.concat(question.correctAnswer)
    const newQuestion = {
      answers,
      question: question.question.text,
      id: question.id,
      difficulty: question.difficulty,
      category: question.category,
      correctAnswer: question.correctAnswer
    }

    return newQuestion
  })

  questionsList.push(...sanitizedQuestions)
  console.log(questionsList);
  console.log('\n');
}
// fetchTheTriviaAPI()

async function fetchOpenTriviaDB () {
  const url = 'https://opentdb.com/api.php?amount=50&type=multiple'

  const req = await fetch(url)
  const res = await req.json()

  const sanitizedQuestions = res.results.map((question) => {
    const answers = question.incorrect_answers.concat(question.correct_answer)
    const newQuestion = {
      answers,
      question: question.question,
      id: randomUUID(),
      difficulty: question.difficulty,
      category: question.category,
      correctAnswer: question.correct_answer
    }

    return newQuestion
  })

  questionsList.push(...sanitizedQuestions)
  console.log(questionsList);
  console.log('\n');
}
// fetchOpenTriviaDB()

async function fetchJService () {
  const url = 'https://opentdb.com/api.php?amount=50&type=multiple'

  const req = await fetch(url)
  const res = await req.json()

  const sanitizedQuestions = res.results.map((question) => {
    const answers = question.incorrect_answers.concat(question.correct_answer)
    const newQuestion = {
      answers,
      question: question.question,
      id: randomUUID(),
      difficulty: question.difficulty,
      category: question.category,
      correctAnswer: question.correct_answer
    }

    return newQuestion
  })

  questionsList.push(...sanitizedQuestions)
  console.log(questionsList);
  console.log('\n');
}
fetchJService()




function removeDuplicateQuestions(questions) {
  const uniqueQuestions = {};
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
