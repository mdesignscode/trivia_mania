import Link from "next/link";
import Categories from "@/components/categories";

function HomePage() {
  return (
    <div className="homepage flex flex-col">
      <main className="main-content flex-col items-center flex">
        <div className="mb-4 mt-5">
          <h2 className="text-3xl mb-2 font-bold underline">Welcome to Trivia Mania!</h2>
          <p>Test your knowledge with exciting trivia questions.</p>
        </div>

        <div className="text-center">
          {Categories.map((category) => {
            return <p key={category}>{category}</p>;
          })}
        </div>

        <Link className="start-button mt-4" href="/game">
          Start Playing
        </Link>
      </main>

      <footer className="footer w-full py-3 flex justify-center fixed bottom-0">
        <p>&copy; 2023 Trivia Mania. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
