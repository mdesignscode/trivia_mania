import { ReduxProvider } from "@/lib/providers";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/navigation";
import Providers from "./providers";

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
            className={`${inter.className} h-full bg-slate-200 col`}
          >
            <Navigation />

            <Providers>{children}</Providers>
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
