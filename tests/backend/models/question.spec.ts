import Question from "@/models/question";

// Sample data for testing
const sampleQuestionData = {
  category: 'Sample Category',
  answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
  correctAnswer: 'Answer 1',
  id: '12345',
  question: 'Sample Question',
  difficulty: 'Easy',
};

describe('Question Class Tests', () => {
  // Test the constructor and properties
  it('should create a new Question object with correct properties', () => {
    const question = new Question(sampleQuestionData);

    expect(question.category).toBe(sampleQuestionData.category);
    expect(question.answers).toEqual(sampleQuestionData.answers);
    expect(question.id).toBe(sampleQuestionData.id);
    expect(question.question).toBe(sampleQuestionData.question);
    expect(question.difficulty).toBe(sampleQuestionData.difficulty);
  });

  // Test the shuffleAnswers method
  it('should shuffle the answer choices. Will sometimes fail due to algorithm used.', () => {
    const question = new Question(sampleQuestionData);
    const originalAnswers = [...question.answers];

    question.shuffleAnswers();

    expect(question.answers).not.toEqual(originalAnswers);
  });

  // Test the isCorrectAnswer method
  it('should correctly identify a correct answer', () => {
    const question = new Question(sampleQuestionData);

    expect(question.isCorrectAnswer('Answer 1')).toBe(true);
    expect(question.isCorrectAnswer('Answer 2')).toBe(false);
  });
});
