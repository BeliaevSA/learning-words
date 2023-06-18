export interface IWord {
  id: number;
  author: number;
  wordEn: string;
  wordRu: string;
}

export interface IUser {
  userId: string | null;
  login: string;
}

export interface ITotalCards {
  startIndex: number;
  finishIndex: number;
}
