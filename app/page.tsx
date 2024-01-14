import HomePage from "@/components/home";
import { HomeProvider } from "@/context/homeContext";

export default async function Home() {

  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  )
}
