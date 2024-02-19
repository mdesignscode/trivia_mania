import HomePage from "@/components/home";
import { HomeProvider } from "@/context/homeContext";

export const dynamic = "force-dynamic"

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    request = await fetch(baseUrl + "questions/stats"),
    {
      categories,
      difficulties,
    }: {
      difficulties: TQuestionStats;
      categories: Record<string, TQuestionStats>;
    } = await request.json();

  return (
    <HomeProvider categoryStats={categories} difficultyStats={difficulties}>
      <HomePage />
    </HomeProvider>
  );
}
