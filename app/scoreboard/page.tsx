import Board from "./components/scoreboard"


export const dynamic = "force-dynamic";

export default async function ScoreBoard () {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    url = baseUrl + "users/topTenPlayers",
    request = await fetch(url),
    response: TTopTenPlayers = await request.json();

  return <Board topTenUsers={response} />;
}
