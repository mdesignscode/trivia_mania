import HomePage from "@/components/home";
import storage from "../models";

export default async function Home() {
  const stats = storage.questionsStats()

  return (
    <HomePage stats={stats} />
  )
}
