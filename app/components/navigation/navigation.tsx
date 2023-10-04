"use client";
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
import { GlobalContext } from "app/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import DesktopNav from "./desktop";
import MobileNav from "./mobile";

const navigation = [
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
    <Disclosure as="nav" className="bg-secondary text-light z-10 sticky top-0">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    className="hover:bg-gray-700 rounded-md px-3 py-1"
                    href="/"
                  >
                    <h1 className="text-white text-3xl">Trivia Mania</h1>
                  </Link>
                </div>
              </div>

              {/* Desktop Navigation */}
              <DesktopNav
                {...{
                  path,
                  navigation,
                  userStatus,
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav {...{ path, navigation, userStatus }} />
        </>
      )}
    </Disclosure>
  );
}
