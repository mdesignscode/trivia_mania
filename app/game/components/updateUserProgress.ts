
interface IUpdateStatsBody {
  user: NonNullable<TUser>;
  answeredCorrect: boolean;
  question: TQuestion
}

export default async function updateProgress({
  user,
  question,
  answeredCorrect,
}: {
  user: NonNullable<TUser>;
  question: NonNullable<TQuestion>;
  answeredCorrect: boolean;
}) {
  const postBody: IUpdateStatsBody = {
    answeredCorrect,
    question,
    user,
  },
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    url = baseUrl + "users/updateStats";

  try {
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    })
    await request.json();
  } catch (error: any) {
    console.log(error.message);
  }
}
