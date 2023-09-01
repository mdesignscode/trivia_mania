export interface IQuestionProps {
  category: string,
  answers: Array<string>
  correctAnswer: string,
  id: string,
  question: string,
  difficulty: string
}

export default function Question(props: IQuestionProps) {
  shuffleAnswers(props.answers)

  return (
    <div className="question">
      <h1>{props.question}</h1>

      <ul className="question_options">
        {props.answers.map(answer => {
          return <li key={answer}>{answer}</li>
        })}
      </ul>
    </div>
  );
}

function shuffleAnswers(answers: Array<string>) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]]; // Swap elements
  }
}
