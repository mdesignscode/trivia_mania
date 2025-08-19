import type { TAllCategories, TQuestionData } from "utils/processCategories";
import type { globalStore } from "utils/store";

export const mockAllCategories: TAllCategories = {
        'Society And Culture': {
                easy: { difficulty: 'easy', count: 1, category: 'Society And Culture' },
                hard: { difficulty: 'hard', count: 1, category: 'Society And Culture' },
                'all difficulties': {
                        difficulty: 'all difficulties',
                        count: 2,
                        category: 'Society And Culture'
                }
        },
        'Science': {
                easy: { difficulty: 'easy', count: 2, category: 'Science' },
                hard: { difficulty: 'hard', count: 1, category: 'Science' },
                'all difficulties': {
                        difficulty: 'all difficulties',
                        count: 3,
                        category: 'Science'
                }
        },
        'All Categories': {
                easy: { difficulty: 'easy', count: 3, category: 'All Categories' },
                hard: { difficulty: 'hard', count: 2, category: 'All Categories' },
                'all difficulties': {
                        difficulty: 'all difficulties',
                        count: 5,
                        category: 'All Categories'
                }
        }
}

export const mockAllQuestions = [
        {
                id: 1,
                category: 'Society And Culture',
                answers: [
                        'Operation Barbarossa',
                        'Operation Overlord',
                        'Operation Watchtower',
                        'Operation Torch'
                ],
                correctAnswer: 'Operation Overlord',
                question: 'What was the code name of the Allied invasion of Normandy in 1944?',
                difficulty: 'easy',
        },
        {
                id: 2,
                category: 'Science',
                answers: ['Fahrenheit', 'Kelvin', 'Celsius', 'Rankine'],
                correctAnswer: 'Celsius',
                question: 'On which scale is normal human body temperature approximately 37 degrees?',
                difficulty: 'easy',
        },
        {
                id: 3,
                category: 'Science',
                answers: ['British Aerospace', 'Supermarine', 'Boeing', 'Rolls Royce'],
                correctAnswer: 'Supermarine',
                question: 'Which Aircraft Manufactuer Produced The Spitfire? ',
                difficulty: 'hard',
        },
        {
                id: 4,
                category: 'Society And Culture',
                answers: [
                        'Toronto Raptors',
                        'Toronto Football',
                        'Toronto Islanders',
                        'Toronto Falcons'
                ],
                correctAnswer: 'Toronto Raptors',
                question: 'Which of these is a basketball team based in Toronto?',
                difficulty: 'hard',
        },
        {
                id: 5,
                category: 'Science',
                answers: ['The tumble', 'The toss', 'The spin', 'The shake'],
                correctAnswer: 'The spin',
                question: 'What is the name of the cycle in a washing machine that dries clothes?',
                difficulty: 'easy',
        },
]

export const mockUser: typeof globalStore.user = {
        id: 'mock-id',
        email: 'mockuser@email',
        avatar: 'defaulf-avatar.png',
        username: 'mock user',
        isVerified: true,
        answeredQuestions: [],
};

