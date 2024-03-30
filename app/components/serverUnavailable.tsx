import Image from "next/image";

export default function ServerUnavailable() {
  return (
    <div className="w-full h-[100dvh] relative z-50 col bg-dark md:flex-row font-bold text-center md:text-xl items-center md:justify-center lg:text-2xl">
      <p className=" md:absolute md:left-[36%] lg:left-[40%] md:rotate-[-30deg] md:-translate-x-1/2 md:top-1/3 md:-translate-y-1/2 z-10">Ooops, seems like our server is down</p>

      <div className="relative w-80 aspect-square md:w-[500px]">
        <Image
          src="/bug-fixing-30.svg"
          fill
          alt="Server erro illustration"
          sizes="(max-width: 480px) 300px, (min-width: 481px) 400px"
        />
      </div>

      <p className=" md:absolute md:right-1/3 md:-translate-x-1/3 md:bottom-1/3 md:-translate-y-1/3 z-10">Please check back later</p>
    </div>
  );
}
