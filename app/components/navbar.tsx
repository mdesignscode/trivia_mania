import Link from "next/link";

function Navbar() {
  return (
    <header className="header">
      <h1>Trivia Mania</h1>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/game">Play</Link>
      </nav>
    </header>
  );
}

export default Navbar;
