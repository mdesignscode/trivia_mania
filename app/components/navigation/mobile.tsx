/* Render mobile navbar */
"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Disclosure } from "@headlessui/react";
import { ChartBarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { NavProps } from ".";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileNav({
  navigation,
  path,
  user,
  userOnline,
}: NavProps) {
  const styles = {
    active: "bg-gray-900 text-white",
    inActive: ["text-gray-300 hover:bg-gray-700 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center"]
  };

  return (
    <Disclosure.Panel className="md:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {navigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.href === path
                ? styles.active
                : styles.inActive[0],
              styles.inActive[1]
            )}
            aria-current={item.href === path ? "page" : undefined}
          >
            {item.icon}
            {item.name}
          </Disclosure.Button>
        ))}

        {/* User stats and Clerk.js User button */}
        <div className="col gap-2">
          {user && userOnline && (
            <Link
              href={`/users/${user.id}`}
              className={classNames(
                `/users/${user.id}` === path
                  ? styles.active
                  : styles.inActive[0], styles.inActive[1]
              )}
              aria-current={`/users/${user.id}` === path ? "page" : undefined}
            >
              <ChartBarIcon height={25} width={25} />
              Your Stats
            </Link>
          )}

          <div
            className={classNames(
              /signin|signup/.test(path)
                ? styles.active
                : styles.inActive[0], styles.inActive[1]
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
  );
}
