import type { TQuestionAttributes } from "models";

export type TPlayStore = {
        questions: TQuestionAttributes[],
        startPlaying: boolean,
        questionIndex: number,
        totalQuestions: number,
        userStats: any,
        totalCorrect: number,
        answeredQuestions: TQuestionAttributes['id'][],
        globalIndex: number
}

export let playStore: TPlayStore = $state({
        questions: [],
        startPlaying: false,
        questionIndex: 0,
        totalQuestions: 0,
        userStats: {},
        totalCorrect: 0,
        answeredQuestions: [],
        globalIndex: 1,
});

type TTimer = {
        state: 'started' | 'continue later' | 'ended' | null,
        userAnswer: string,
        timer: null | ReturnType<typeof setInterval>,
};

export type TQuestionStore = {
        timers: TTimer[],
}
export let questionStore: TQuestionStore = $state({
        timers: [],
});

