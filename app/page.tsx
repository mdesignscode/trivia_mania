import HomePage from "./components/home";
import Question, { IQuestionProps } from "./components/question";

export default function Home() {
  const question: IQuestionProps = {
    category: "science",
    correctAnswer: "A Fry",
    difficulty: "medium",
    id: "624333edcfaae40c12961410",
    answers: ['A Cygnet', 'A Chick', 'A Kitten', "A Fry"],
    question: 'A young fish is known as what?',
  }

  return (
    <HomePage />
  )
}
