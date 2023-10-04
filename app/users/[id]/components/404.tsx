import Image from "next/image";

export default function NotFound({ id }: { id: string }) {
  return (
    <div className="col h-full items-center justify-center text-center">
      <div className="col md:flex-row md:gap-2 text-xl md:text-2xl">
        <h1>User with id</h1>
        <h1>{id}</h1>
        <h1>not found</h1>
      </div>
      <Image
        src="/Oops! 404 Error with a broken robot-pana.svg"
        width={400}
        height={400}
        alt="Page not found error"
      />
    </div>
  );
}
