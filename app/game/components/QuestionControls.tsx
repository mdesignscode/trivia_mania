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
}

export default function QuestionControls({
  setQuestionIndex,
  timerState,
  currentAction,
}: IQuestionControlsProps) {
  const router = useRouter();

  return (
    <div className="col gap-2">
      <Button
        className={classNames("flex items-center gap-4 justify-center")}
        onClick={() => router.push("/stats")}
      >
        Continue later
      </Button>

      {timerState === "ended" && (
        <Button
          onClick={() =>
            handleNextQuestion({
              setQuestionIndex,
              router,
              currentAction,
            })
          }
          className={classNames("flex items-center gap-4 justify-center")}
        >
          {currentAction}
        </Button>
      )}
    </div>
  );
}
