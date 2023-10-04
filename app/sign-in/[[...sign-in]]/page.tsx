"use client";
import { dark } from "@clerk/themes";
import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Page() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // Dark mode is preferred
      setIsDark(true);
    } else setIsDark(false)
  }, [window]);

  return (
    <div className="grid place-content-center py-10">
      {isDark ? (
        <SignIn
          appearance={{
            baseTheme: dark,
          }}
        />
      ) : (
        <SignIn />
      )}
    </div>
  );
}
