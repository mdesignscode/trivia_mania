"use client"
import { useState } from "react";
import LogIn from "./components/signin";
import SignUp from "./components/signup";

export default function SignIn () {
  const [hasAccount, setHasAccount] = useState(true)

  return hasAccount
    ? <LogIn setHasAccount={setHasAccount} />
    : <SignUp setHasAccount={setHasAccount} />
}