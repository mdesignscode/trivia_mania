type TUser = ({
  stats: {
    id: number;
    avatar: string | null;
    answeredQuestions: string[];
    statsTotalId: number;
  };
} & {
  id: string;
  username: string;
  userStatsId: number;
})

type TCategoryStat = ({
  difficultyStats: {
    id: number;
    answered: number;
    correctAnswered: number;
    userStatsId: number | null;
    categoryStatId: number | null;
  }[];
} & {
  id: number;
  userStatsId: number | null;
})

type TDifficultyStat = {
  id: number;
  answered: number;
  correctAnswered: number;
  userStatsId: number | null;
  categoryStatId: number | null;
}

type TUserStats = ({
  difficultyStats: TDifficultyStat
} & {
  total: {
    id: number;
    answered: number;
    correctAnswered: number;
  };
} & {
  categoryStats: ({
    difficultyStats: TDifficultyStat[];
  } & {
    id: number;
    userStatsId: number | null;
  })[];
} & {
  id: number;
  avatar: string | null;
  answeredQuestions: string[];
  statsTotalId: number;
})

type TQuestion = {
  category: string;
  answers: string[];
  correctAnswer: string;
  id: number;
  question: string;
  difficulty: string;
}

type TQuestionStats = {
  [key: string]: number
}
