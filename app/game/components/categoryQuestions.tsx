import { Transition } from "@headlessui/react"
import Question, { IQuestionProps } from "@/components/question";

const questionObj: IQuestionProps = {
	category: "science",
	correctAnswer: "A Fry",
	difficulty: "medium",
	id: "624333edcfaae40c12961410",
	answers: ['A Cygnet', 'A Chick', 'A Kitten', "A Fry"],
	question: 'A young fish is known as what?',
}

type AppProps = {
	category: string
}

export default function CategoryQuestions({ category }: AppProps) {
	return <Transition
		show={Boolean(category)}
		enter="transition-opacity duration-300"
		enterFrom="opacity-0"
		enterTo="opacity-100"
		className="flex flex-col justify-center h-full"
	>
		<Question {...{questionObj}} />
	</Transition>
}
