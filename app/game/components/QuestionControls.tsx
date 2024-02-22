"use client";

import SpinningLoader from "@/components/SpinningLoader";
import { classNames } from "@/components/navigation/desktop";
import { Button } from "@/components/styledComponents";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { TTimerState, handleNextQuestion } from "./QuestionHandlers";

interface IQuestionControlsProps {
  setQuestionIndex: Dispatch<SetStateAction<number>>;
  timerState: TTimerState;
  currentAction: string;
  updatingStats: boolean;
}

export default function QuestionControls({
  setQuestionIndex,
  timerState,
  currentAction,
  updatingStats,
}: IQuestionControlsProps) {
  const router = useRouter();

  return (
    <div className="col gap-2">
      <Button
        disabled={updatingStats}
        className={classNames(
          "flex items-center gap-4 justify-center",
          updatingStats ? "opacity-50" : ""
        )}
        onClick={() => router.push("/stats")}
      >
        Continue later
        {updatingStats && <SpinningLoader />}
      </Button>

      {timerState === "ended" && (
        <Button
          disabled={updatingStats}
          onClick={() =>
            handleNextQuestion({
              setQuestionIndex,
              router,
              currentAction,
            })
          }
          className={classNames(
            "flex items-center gap-4 justify-center",
            updatingStats ? "opacity-50" : ""
          )}
        >
          {currentAction}
          {updatingStats && <SpinningLoader />}
        </Button>
      )}
    </div>
  );
}
