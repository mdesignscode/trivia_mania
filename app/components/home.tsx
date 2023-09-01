import Categories from "./categories";

function HomePage() {
  return (
    <div className="homepage">
      <main className="main-content">
        <h2>Welcome to Trivia Mania!</h2>
        <p>Test your knowledge with exciting trivia questions.</p>

        <Categories />

        <button className="start-button">Start Playing</button>
      </main>

      <footer className="footer">
        <p>&copy; 2023 Trivia Mania. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
