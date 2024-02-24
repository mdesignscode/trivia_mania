type TUser = ({
  easyStats: {
    id: number;
  };
  mediumStats: {
    id: number;
  };
  hardStats: {
    id: number;
  };
} & {
  id: string;
  username: string;
  avatar: string;
  answeredQuestions: number[];
  correctAnswered: number;
  totalAnswered: number;
  easyStatId: number;
  mediumStatId: number;
  hardStatId: number;
}) | null

type TCategoryStat = {
  id: number;
  category: string;
  easyId: number;
  easyAnswered: number;
  easyCorrect: number;
  mediumId: number;
  mediumAnswered: number;
  mediumCorrect: number;
  hardId: number;
  hardAnswered: number;
  hardCorrect: number;
} | null

type TQuestion = {
  category: string;
  answers: string[];
  correctAnswer: string;
  id: number;
  question: string;
  difficulty: string;
}

type TTopTenPlayers = {
  user: TUser;
  stats: TCategoryStat[]
}[]

type TQuestionStats = {
  [key: string]: number
}
