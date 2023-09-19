import Link from "next/link";

interface IPlayProps {
  difficulty: string;
  categories: Array<string>;
}

export default function Play({ difficulty, categories }: IPlayProps) {
  return (
    <Link
      className="start-button mt-4"
      href={encodeURI(
        `/game?difficulty=${difficulty}&categories=${categories.join(",")}`
      )}
    >
      Start Playing
    </Link>
  );
}
