import QueryProvider from "@/context/queryProvider";
import "@/styles/globals.css";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Body from "./components/body";
import { GlobalProvider } from "./context/globalContext";
import SetActiveUser from "./components/setActiveUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trivia Mania",
  description: "Portfolio Project by Marlon Baatjes",
  manifest: "/site.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#ffcb74",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()

  return (
    <ClerkProvider>
      <QueryProvider>
        <GlobalProvider>
          <html lang="en" className="h-full">
            <body
              className={`${inter.className} h-full bg-light dark:bg-secondary text-dark dark:text-light col overflow-y-hidden`}
            >
              {!!user && <SetActiveUser user={JSON.stringify(user)} />}
              <Body>{children}</Body>
            </body>
          </html>
        </GlobalProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
