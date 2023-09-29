import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/navigation";
import Providers from "./providers";
import { GlobalProvider } from "./store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trivia Mania",
  description: "Portfolio Project by Marlon for ALX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <GlobalProvider>
        <html lang="en" className="h-full">
          <body className={`${inter.className} h-full bg-slate-200 col`}>
            <Navigation />

            <Providers>{children}</Providers>
          </body>
        </html>
      </GlobalProvider>
    </ClerkProvider>
  );
}
