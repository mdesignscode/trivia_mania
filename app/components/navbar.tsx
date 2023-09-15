"use client";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PuzzlePieceIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { usePathname } from "next/navigation";

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

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const path = usePathname();

  return (
    <Disclosure as="nav" className="bg-gray-800 z-10 sticky top-0">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
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
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <h1 className="text-white text-3xl">Trivia Mania</h1>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === path
                            ? "bg-gray-900 text-white flex gap-2 content-center items-center"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center"
                        )}
                        aria-current={item.href === path ? "page" : undefined}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}

                    <div
                      className={classNames(
                        /[signin|signup]/.test(path)
                          ? "bg-gray-900 text-white flex gap-2 content-center items-center"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center"
                      )}
                    >
                      <SignedIn>
                        {/* Mount the UserButton component */}
                        <UserButton />
                      </SignedIn>
                      <SignedOut>
                        <UserCircleIcon height={25} width={25} />
                        {/* Signed out users get sign in button */}
                        <SignInButton />
                      </SignedOut>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href === path
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.href === path ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}

              <div
                className={classNames(
                  /signin/.test(path)
                    ? "bg-gray-900 text-white flex gap-2 content-center items-center"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center"
                )}
              >
                <SignedIn>
                  {/* Mount the UserButton component */}
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  {/* Signed out users get sign in button */}
                  <SignInButton />
                </SignedOut>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
