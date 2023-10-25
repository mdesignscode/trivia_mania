export const QUESTIONS_POOL = "questionsPool",
  POOL_INDEX = "poolIndex",
  CURRENT_INDEX = "currentIndex",
  QUESTIONS_LIST = "questionsList",
  QUESTION_ANSWERED = "questionAnswered",
  ANSWERED_QUESTIONS = "answeredQuestions",
  PROGRESS = "progress",
  LAST_ANSWER = "lastAnswer",
  LAST_ANSWER_INDEX = "lastAnswerIndex",
  NEW_PARAMS = "newParams",
  CATEGORIES = "categories",
  DIFFICULTY = "difficulty",
  UNSAVED_DATA = "unsavedData",
  USERNAME = "username"

export function clearQuestionData() {
  localStorage.removeItem(UNSAVED_DATA);
  localStorage.removeItem(QUESTIONS_LIST);
  localStorage.removeItem(QUESTIONS_POOL);
  localStorage.removeItem(POOL_INDEX);
  localStorage.removeItem(CURRENT_INDEX);
  localStorage.removeItem(ANSWERED_QUESTIONS);
  localStorage.removeItem(LAST_ANSWER);
  localStorage.removeItem(LAST_ANSWER_INDEX);
  localStorage.removeItem(ANSWERED_QUESTIONS);
  localStorage.removeItem(NEW_PARAMS);
}
