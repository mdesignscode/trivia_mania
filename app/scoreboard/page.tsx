import Board from "./components/scoreboard"

export default async function ScoreBoard () {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    url = baseUrl + "users/topTenPlayers",
    request = await fetch(url),
    response = await request.json()

  console.log(response)

  return <Board topTenUsers={response} />;
}
