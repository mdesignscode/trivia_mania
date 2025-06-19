export let playStore = $state({
        questions: [],
        startPlaying: false,
        questionIndex: 0,
        totalQuestions: 0,
        userStats: {},
        totalCorrect: 0,
        answeredQuestions: [],
        globalIndex: 1,
});

export let questionStore = $state({
        timers: [] // list of timers for each question
});

