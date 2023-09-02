import { Button } from "./styledComponents"

export interface IQuestionProps {
  category: string,
  answers: Array<string>
  correctAnswer: string,
  id: string,
  question: string,
  difficulty: string
}

type AppProps = {
  questionObj: IQuestionProps
}

export default function Question({ questionObj }: AppProps) {
  shuffleAnswers(questionObj.answers)

  return (
    <div className="question mx-auto w-2/3">
      <div className="flex">
        <h1>{questionObj.question}</h1>

        <p>{questionObj.difficulty}</p>
      </div>

      <div className="question_options grid grid-cols-2 grid-rows-2">
        {questionObj.answers.map(answer => {
          return <Button key={answer}>{answer}</Button>
        })}
      </div>
    </div>
  );
}

function shuffleAnswers(answers: Array<string>) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]]; // Swap elements
  }
}
