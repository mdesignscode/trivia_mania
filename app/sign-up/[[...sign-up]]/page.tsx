"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-content-center py-10 overflow-y-auto">
      <SignUp />
    </div>
  );
}
