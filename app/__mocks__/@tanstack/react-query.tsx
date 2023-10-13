import { mockUser } from "@/utils/test_global_context";
import {
  mockCategoryStats,
  mockDifficultyStats,
  mockQuestions,
} from "mockData";

// mock QueryClient
export class QueryClient {
  invalidateQueries: Function;

  constructor() {
    this.invalidateQueries = jest.fn();
  }
}

interface IUseQueryProps {
  queryKey: string[];
  queryFn?: Function;
  initialData?: any;
  enabled?: boolean;
}

type TQueryResponse = {
  data: any;
  isFetched: boolean;
};

// mock useQuery
export function useQuery(options: IUseQueryProps): TQueryResponse {
  const response: TQueryResponse = {
    data: {},
    isFetched: true,
  };

  // return different mock data various queries
  switch (options.queryKey[0]) {
    case "categoryStats":
      response.data = mockCategoryStats;
      break;

    case "difficultyStats":
      response.data = mockDifficultyStats;
      break;

    case "play":
      response.data = Object.values(mockQuestions);
      break;

    case "getUser":
      response.data = mockUser;
      break;

    default:
      break;
  }

  return response;
}

// mock provider
export function QueryClientProvider({
  client,
  children,
}: {
  client: any;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
