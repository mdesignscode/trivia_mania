type TUser = ({
  stats: TUserStats
} & {
  id: string;
  username: string;
  userStatsId: number | null;
  answeredQuestions: number[];
}) | null

type TCategoryStat = ({
  difficultyStats: TDifficultyStat[];
} & {
  id?: number;
  userStatsId?: number | null;
  category: string;
}) | null

type TDifficultyStat = {
  id?: number;
  answered: number;
  correctAnswered: number;
  userStatsId?: number | null;
  categoryStatId?: number | null;
  difficulty: string;
} | null

type TTotal = Omit<{
  id: number;
  answered: number;
  correctAnswered: number;
}, "id">

type TUserStats = ({
  total: TTotal
  difficultyStats: TDifficultyStat[]
  categoryStats: TCategoryStat[]
  answeredQuestions: number[]
} & {
  id?: number;
  statsTotalId?: number;
}) | null

type TQuestion = {
  category: string;
  answers: string[];
  correctAnswer: string;
  id: number;
  question: string;
  difficulty: string;
} | null

type TQuestionStats = {
  [key: string]: number
}
