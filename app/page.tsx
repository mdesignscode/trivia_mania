import HomePage from "@/components/home";
import { HomeProvider } from "@/context/homeContext";
import { currentUser } from "@clerk/nextjs";
import ServerUnavailable from "./components/serverUnavailable";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser(),
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const request = await fetch(baseUrl + "questions/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user?.id }),
    });
    const {
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
  } catch (error) {
    console.log(error)
  }
}
