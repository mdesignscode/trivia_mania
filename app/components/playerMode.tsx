import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "../context/globalContext";
import { Button } from "./styledComponents";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@mui/material";

export default function PlayerMode({
  shouldRender,
}: {
  shouldRender: boolean;
}) {
  const { setPlayerMode, setPageReady, triviaUser } = useContext(GlobalContext),
    { isLoaded, isSignedIn } = useUser(),
    router = useRouter();

  function handlePlayerMode(mode: boolean) {
    if (mode) {
      setPlayerMode("Signed In");
      setPageReady(true);
      if (!triviaUser) {
        router.push("/sign-in");
      }
    } else {
      setPageReady(true);
    }
  }

  if (!shouldRender) return;

  if (isLoaded && isSignedIn && !triviaUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="col gap-4 w-52 mx-auto items-center"
      >
        <div className="w-24 rounded-lg h-10 animate-pulse bg-dark dark:bg-light" />
        <div className="w-52 rounded-lg h-9 animate-pulse bg-dark dark:bg-light" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="col text-center w-52 mx-auto gap-4"
      data-testid="player-mode-container"
    >
      <h1 className="text-3xl">Play as</h1>

      {triviaUser ? (
        <Button testid="continue-button" onClick={() => handlePlayerMode(true)}>
          Continue as <strong>{triviaUser.username}</strong>
        </Button>
      ) : (
        <>
          <Button
            testid="guest-user-button"
            onClick={() => handlePlayerMode(false)}
          >
            Guest User
          </Button>
          <Button testid="signin-button" onClick={() => handlePlayerMode(true)}>
            Sign In
          </Button>
        </>
      )}
    </motion.div>
  );
}
