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
  stats: Record<string, Record<string, any>>;
  avatar: string;
}
