import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import "@/styles/globals.css";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/lib/providers";

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
  // casually sync storage in background
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const url = baseUrl + "users/syncUsers";
  // axios.post(url);

  return (
    <ClerkProvider>
      <ReduxProvider>
        <html lang="en" className="h-full">
          <body
            className={`${inter.className} h-full bg-slate-200 flex flex-col`}
          >
            <Navbar />

            <Providers>{children}</Providers>
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
