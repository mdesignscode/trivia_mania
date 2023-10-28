#!/usr/bin/node

import { IQuestion } from "./interfaces";

class Question {
  // Properties
  category: string;
  answers: Array<string>;
  correctAnswer: string;
  id: string;
  question: string;
  difficulty: string;

  // Constructor to initialize properties
  constructor(data: IQuestion) {
    this.category = data.category;
    this.answers = data.answers;
    this.correctAnswer = data.correctAnswer;
    this.id = data.id;
    this.question = data.question;
    this.difficulty = data.difficulty;

    this.shuffleAnswers()
  }

  // Method to check if a given answer is correct
  isCorrectAnswer(answer: string): boolean {
    return answer === this.correctAnswer;
  }

  // Method to shuffle the answer choices (randomize)
  shuffleAnswers(): void {
    for (let i = this.answers.length - 1; i > 0; i--) {
      const index = Math.floor(Math.random() * (i + 1));
      const j = index === i ? i + 1 : index;
      [this.answers[i], this.answers[j]] = [this.answers[j], this.answers[i]];
    }
  }

  // Method to display the question and answer choices
  displayQuestion(): void {
    console.log(`Category: ${this.category}`);
    console.log(`Question: ${this.question}`);
    console.log(`Difficulty: ${this.difficulty}`);
    console.log(`Answers:`);
    this.answers.forEach((answer, index) => {
      console.log(`${index + 1}. ${answer}`);
    });
  }
}

export default Question;
