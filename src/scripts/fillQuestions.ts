import { Question } from "models";
import { retrieveObject, storeObject } from "./cacheFillData";

const allQuestions = [];

export async function fillQuestions() {
        const filePath = "questionsCache.json";

        const cache = await retrieveObject(filePath);

        if (cache) {
                console.log('Cache found');
                for (const question of cache) {
                        try {
                                await Question.create(question);
                        } catch (error) {
                                console.log('DB populated with questions already')
                                return;
                        }
                };

                return;
        }

        for (let i = 0; i < 50; i++) {
                const url = 'https://the-trivia-api.com/v2/questions?limit=50';
                const request = await fetch(url);
                const response = await request.json();

                for (const question of response) {
                        const answers = [...question.incorrectAnswers, question.correctAnswer];

                        // Fisher-Yates shuffle
                        for (let i = answers.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [answers[i], answers[j]] = [answers[j], answers[i]];
                        }

                        const newQuestion = {
                                question: question.question.text,
                                difficulty: question.difficulty,
                                answers,
                                correctAnswer: question.correctAnswer,
                                category: splitAndCapitalize(question.category),
                        };

                        try {
                                await Question.create(newQuestion);
                                allQuestions.push(newQuestion);
                        } catch (error) {
                                console.log('DB populated already')
                                return;
                        }
                }
        }

        await storeObject(filePath, allQuestions);
}

function splitAndCapitalize(inputString: string): string {
        return inputString
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
}

