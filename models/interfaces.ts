import Question from "./question";

export interface IQuestion {
  category: string;
  answers: Array<string>;
  correctAnswer: string;
  id: string;
  question: string;
  difficulty: string;
}

export interface IUser {
  username: string;
  id: string;
  stats: IUserStats;
  avatar: string;
  answeredQuestions: string[];
}

export type DifficultyStat = {
  answered: number;
  correctAnswered: number;
};

export type CategoryStat = {
  [key: string]: DifficultyStat;
};

export interface IUserStats {
  [key: string]: DifficultyStat | CategoryStat;
  total: DifficultyStat;
}

export const initialStat: IUserStats = {
  total: { answered: 0, correctAnswered: 0 },
};
