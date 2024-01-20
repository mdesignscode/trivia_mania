"use client";
import { Button } from "@/components/styledComponents";
import { GlobalContext } from "@/context/globalContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  ANSWERED_QUESTIONS,
  UNSAVED_DATA,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { IUpdateUserStatsRequest } from "@/models/customRequests";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import User from "@/models/user";

export default function HandleUnsavedProgress() {
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const mutation = useMutation(() => {
    const hasUnsavedData = localStorage.getItem(UNSAVED_DATA) as string;
    const answeredQuestions = localStorage.getItem(
      ANSWERED_QUESTIONS
    ) as string;

    const progress = JSON.parse(hasUnsavedData);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/users/updateStats`;
    const { id } = triviaUser as User;

    return axios.post(url, {
      stats: progress,
      id,
      answeredQuestions: answeredQuestions.split(","),
    } as IUpdateUserStatsRequest);
  });

  const { storageIsAvailable, triviaUser } = useContext(GlobalContext);

  function saveProgress() {
    const hasUnsavedData = localStorage.getItem(UNSAVED_DATA);
    const answeredQuestions = localStorage.getItem(ANSWERED_QUESTIONS);

    if (hasUnsavedData && triviaUser && answeredQuestions) {
      mutation.mutate();
    }
  }

  useEffect(() => {
    if (mutation.data && triviaUser) {
      clearQuestionData();
      router.push("/users/" + triviaUser.id);
    } else if (mutation.error) {
      setError((mutation.error as any).message);
    }
  }, [mutation, router, triviaUser]);

  useEffect(() => {
    if (storageIsAvailable) {
      const hasUnsavedData = localStorage.getItem(UNSAVED_DATA);

      if (hasUnsavedData) {
        setHasUnsavedProgress(true);
      }
    }
  }, [storageIsAvailable]);

  function discardProgress() {
    if (storageIsAvailable) {
      localStorage.removeItem(UNSAVED_DATA);
    }

    if (triviaUser) {
      router.push("/users/" + triviaUser.id);
    }
  }

  return (
    hasUnsavedProgress && (
      <div
        data-testid="handle-unsaved-progress-container"
        className="border-2 dark:border-light pt-3 pb-5 text-center md:text-left col rounded-lg md:w-96 items-center"
      >
        <div className="col gap-2">
          <h1 className="text-2xl">You have unsaved progress.</h1>

          <div className="flex gap-4 text-xl">
            <Button
              testid="save-progress-button"
              onClick={saveProgress}
              primary={true}
            >
              Save progress
            </Button>

            <Button onClick={discardProgress} testid="discard-progress-button">
              Discard Progress
            </Button>
          </div>

          {error && <div className="text-2xl">{error}</div>}
        </div>
      </div>
    )
  );
}
