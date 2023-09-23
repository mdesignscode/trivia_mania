import HomePage from "@/components/home";
import storage from "../models";
import { HomeProvider } from "./components/home/store";

export default async function Home() {
  const stats = storage.questionsStats()

  return (
    <HomeProvider stats={stats}>
      <HomePage />
    </HomeProvider>
  )
}
