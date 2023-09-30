import HomePage from "@/components/home";
import { HomeProvider } from "./components/home/store";

export default async function Home() {

  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  )
}
