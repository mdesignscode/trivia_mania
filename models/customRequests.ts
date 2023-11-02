import { IUserStats } from "./interfaces";

export type TDifficulties = "easy" | "medium" | "hard" | ""

export interface IPlayRequest {
  difficulty?: TDifficulties;
  categories?: string[];
  userId?: string;
}

export class PlayRequest extends Request {
  constructor(url: string, options?: RequestInit, customData?: IPlayRequest) {
    super(url, mergeOptions(customData, options));
  }
}

export type TStatsRequest =
  | {
    recordType: 'difficulties';
    userId?: string;
  }
  | {
    recordType: 'categories';
    difficulty: TDifficulties;
    userId?: string;
  };

export class StatsRequest extends Request {
  constructor(url: string, options?: RequestInit, customData?: TStatsRequest) {
    super(url, mergeOptions(customData, options));
  }
}

export interface IGetUserRequest {
  id: string
}

export class GetUserRequest extends Request {
  constructor(url: string, options?: RequestInit, customData?: IGetUserRequest) {
    super(url, mergeOptions(customData, options));
  }
}

export interface IUpdateUserStatsRequest {
  id: string;
  answeredQuestions: string[];
  stats: IUserStats
}

export class UpdateUserStatsRequest extends Request {
  constructor(url: string, options?: RequestInit, customData?: IUpdateUserStatsRequest) {
    super(url, mergeOptions(customData, options));
  }
}

function mergeOptions<RequestType>(customData: RequestType, options?: RequestInit) {
  // Serialize your custom data and add it to the request body
  const customBody = JSON.stringify(customData);

  // Merge the custom options with the provided options
  return {
    ...options,
    method: options?.method || 'POST',
    body: customBody,
  };
}
