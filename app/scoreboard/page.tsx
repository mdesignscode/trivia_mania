import Board from "@/components/scoreboard"
import storage from "@/models/index"

export default async function ScoreBoard () {
  const topTenUsers = storage.getTopTenUsers()
  
  return <Board topTenUsers={topTenUsers} />
}
