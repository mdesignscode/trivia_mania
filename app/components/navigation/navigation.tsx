"use client";
import { GlobalContext } from "@/app/store";
import User from "@/models/user";
import { useUser } from "@clerk/nextjs";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  PuzzlePieceIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import DesktopNav from "./desktop";
import MobileNav from "./mobile";

export const navigation = [
  { name: "Home", href: "/", icon: <HomeIcon height={25} width={25} /> },
  {
    name: "Play",
    href: "/game",
    icon: <PuzzlePieceIcon height={25} width={25} />,
  },
  {
    name: "Score Board",
    href: "/scoreboard",
    icon: <StarIcon height={25} width={25} />,
  },
];

export interface NavProps {
  navigation: typeof navigation;
  path: string;
  userStatus: {
    user: User | null;
    isLoaded: boolean;
    isOnline: boolean;
  };
}

export default function Navbar({
  serializedUsers,
}: {
  serializedUsers: string;
}) {
  const users: Record<string, User> = JSON.parse(serializedUsers);
  const path = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { setUserStatus, userStatus, storageIsAvailable, setIsPrevUser } =
    useContext(GlobalContext);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && storageIsAvailable) {
        // set online user
        const triviaUser = users[user.id];
        setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });

        // check if current user is previous user
        const prevUserName = localStorage.getItem("username");

        if (prevUserName) {
          if (prevUserName !== triviaUser.username) {
            // if not previous user, clear localStorage
            setIsPrevUser(false);
            localStorage.setItem("username", triviaUser.username);
            localStorage.removeItem("progress");
            localStorage.removeItem("difficulties");
            localStorage.removeItem("categories");
            localStorage.removeItem("unsavedData");
            localStorage.removeItem("hasUnsavedData");
            localStorage.removeItem("questionsList");
            localStorage.removeItem("questionsPool");
            localStorage.removeItem("poolIndex");
            localStorage.removeItem("currentIndex");
            localStorage.removeItem("answeredQuestions");
          }
        } else {
          localStorage.setItem("username", triviaUser.username);
        }
      } else if (!storageIsAvailable && isSignedIn) {
        // set online user
        const triviaUser = users[user.id];
        setUserStatus({ user: triviaUser, isLoaded: true, isOnline: true });
      } else {
        setUserStatus({ user: null, isLoaded: true, isOnline: false });
      }
    }
  }, [isLoaded, isSignedIn, storageIsAvailable]);

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopNav
        {...{
          path,
          navigation,
          userStatus,
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav {...{ path, navigation, userStatus }} />
    </>
  );
}
