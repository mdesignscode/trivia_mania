import storage from "@/models/index"

export default function UserProgress({ params: { id } }: { params: { id: string } }) {
  const userStats = storage.getUserStats(id)
  console.log(userStats) 

  return <h1>{id} progress</h1>
}
