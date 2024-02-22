import { Dispatch, SetStateAction } from "react";

interface IUpdateStatsBody {
  userId: string;
  stats?: NonNullable<TUserStats>;
  isFirstStat?: boolean;
  question: NonNullable<TQuestion>;
  answeredCorrect: boolean;
  difficultyStatId?: number
  categoryStatId?: number
}

export default async function updateProgress({
  user,
  question,
  answeredCorrect,
  setTriviaUser
}: {
  user: NonNullable<TUser>;
  question: NonNullable<TQuestion>;
  answeredCorrect: boolean;
  setTriviaUser: Dispatch<SetStateAction<TUser>>;
}) {
  const postBody: IUpdateStatsBody = {
    answeredCorrect,
    isFirstStat: !user.stats,
    question,
    userId: user.id,
  },
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    url = baseUrl + "users/updateStats";

  // user has stats
  if (user.stats) {
    postBody.stats = user.stats
    // category stats exist
    if (user.stats.categoryStats) {
      for (const categoryStat of user.stats.categoryStats) {
        // check for existing category stat
        if (categoryStat?.category === question.category) {
          postBody.categoryStatId = categoryStat.id

          // check for existing difficulty stat
          for (const difficultyStat of categoryStat.difficultyStats) {
            if (difficultyStat?.difficulty === question.difficulty) {
              postBody.difficultyStatId = difficultyStat.id
              break;
            }
          }

          break;
        }
      }
    }
  }

  try {
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    }),
      response: TUser = await request.json();
    setTriviaUser(response)
  } catch (error: any) {
    console.log(error.message);
  }
}
