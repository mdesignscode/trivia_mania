/* Render desktop navbar */
"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChartBarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { NavProps } from "./navigation";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

export const navStyles = {
  active:
    "bg-accent text-dark flex gap-2 content-center items-center hover:border-light border-2 border-accent hover:text-light hover:bg-accent-200",
  inActive: [
    "hover:bg-accent-100 hover:text-secondary",
    "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center",
  ],
};

export default function DesktopNav({
  navigation,
  path,
  userStatus: { user, isOnline, isLoaded },
}: NavProps) {
  return (
    <div
      className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0"
      data-testid="desktop-nav-container"
    >
      <div className="hidden md:ml-6 md:block">
        <div className="flex space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.href === path ? navStyles.active : navStyles.inActive[0],
                navStyles.inActive[1]
              )}
              aria-current={item.href === path ? "page" : undefined}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          {/* User stats and Clerk.js User button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex gap-3"
          >
            {isLoaded ? (
              <>
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
              </>
            ) : (
              <CircularProgress color="secondary" />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
