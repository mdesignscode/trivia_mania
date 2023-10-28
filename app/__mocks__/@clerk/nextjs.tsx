export function SignedIn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function UserButton() {
  return <h1>Mock user button</h1>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SignInButton() {
  return <h1>Sign in</h1>;
}

export function useUser() {
  return {
    user: {
      id: "mockId",
    },
    isLoaded: true,
    isSignedIn: true,
  };
}
