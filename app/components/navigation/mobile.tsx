/* Render mobile navbar */
"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  ChartBarIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { NavProps } from ".";
import { navStyles } from "./desktop";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileNav({
  navigation,
  path,
  userStatus: { user, isOnline },
}: NavProps) {
  return (
    <Disclosure
      as="nav"
      className="md:hidden bg-secondary text-light z-10 sticky top-0"
      data-testid="mobile-nav-container"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  data-testid="disclosure-button"
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
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
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href.split("?")[0] === path
                      ? navStyles.active
                      : navStyles.inActive[0],
                    navStyles.inActive[1]
                  )}
                  aria-current={item.href === path ? "page" : undefined}
                >
                  {item.icon}
                  {item.name}
                </Disclosure.Button>
              ))}

              {/* User stats and Clerk.js User button */}
              <div className="col gap-2">
                {user && isOnline && (
                  <Link
                    href={`/users/${user.id}`}
                    className={classNames(
                      `/users/${user.id}` === path
                        ? navStyles.active
                        : navStyles.inActive[0],
                      navStyles.inActive[1]
                    )}
                    aria-current={
                      `/users/${user.id}` === path ? "page" : undefined
                    }
                  >
                    <ChartBarIcon height={25} width={25} />
                    Your Stats
                  </Link>
                )}

                <div
                  className={classNames(
                    /signin|signup/.test(path)
                      ? navStyles.active
                      : navStyles.inActive[0],
                    navStyles.inActive[1]
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
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
