"use client";
import { useSelector } from "@/lib/redux";
import { userSelector } from "@/lib/redux/slices/userSlice/selectors";
import { IUser } from "@/models/interfaces";
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
import { useState } from "react";
import AddUserToStorage from "../addUserToStorage";
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
  user: IUser | null;
  userOnline: boolean;
  fetchingUser?: boolean;
}

export default function Navbar() {
  const path = usePathname();
  const { user } = useSelector(userSelector);
  const [userOnline, setUserOnline] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  AddUserToStorage().then((data) => {
    if (data) {
      setUserOnline(true);
    }
    setFetchingUser(false);
  });

  return (
    <Disclosure as="nav" className="bg-gray-800 z-10 sticky top-0">
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
                  user,
                  userOnline,
                  fetchingUser,
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav {...{ path, navigation, user, userOnline }} />
        </>
      )}
    </Disclosure>
  );
}
