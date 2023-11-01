import QueryProvider from "@/context/queryProvider";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Body from "./components/body";
import { GlobalProvider } from "./context/globalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trivia Mania",
  description: "Portfolio Project by Marlon Baatjes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <GlobalProvider>
          <html lang="en" className="h-full overflow-hidden">
            <body
              className={`${inter.className} h-full bg-light dark:bg-secondary text-dark dark:text-light col`}
            >
              <Body>{children}</Body>
            </body>
          </html>
        </GlobalProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
