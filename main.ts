import storage from "./models";
import Question from "./models/question";

// console.log(storage.questionsStats())

function generateFakeData (): Record<string, Question> {
  return {
    Question1: new Question({
      answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 'Answer 2',
      category: 'General Knowledge',
      difficulty: 'easy',
      id: '1',
      question: 'Some test question'
    }),
    Question2: new Question({
      answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 'Answer 2',
      category: 'Science',
      difficulty: 'medium',
      id: '2',
      question: 'Some test question 2'
    }),
    Question3: new Question({
      answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 'Answer 2',
      category: 'History',
      difficulty: 'hard',
      id: '3',
      question: 'Some test question 3'
    }),
    Question4: new Question({
      answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 'Answer 2',
      category: 'General Knowledge',
      difficulty: 'easy',
      id: '4',
      question: 'Some test question 4'
    })
  };
};

const { Question1, Question2, Question3, Question4 } = generateFakeData();

storage.newQuestion(Question1);
storage.newQuestion(Question2);
storage.newQuestion(Question3);
storage.newQuestion(Question4);

console.log(storage.questionsStats())
