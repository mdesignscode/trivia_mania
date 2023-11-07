"use client";
import { Button } from "@/components/styledComponents";
import { GlobalContext } from "@/context/globalContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import reloadPage from "./reloadPage";
import { ANSWERED_QUESTIONS, UNSAVED_DATA, clearQuestionData } from "@/utils/localStorage_utils";
import { IUpdateUserStatsRequest } from "@/models/customRequests";

export default function HandleUnsavedProgress() {
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);

  const {
    storageIsAvailable,
    triviaUser
  } = useContext(GlobalContext);


  async function saveProgress() {
    const hasUnsavedData = localStorage.getItem(UNSAVED_DATA);
    const answeredQuestions = localStorage.getItem(ANSWERED_QUESTIONS);

    if (hasUnsavedData && triviaUser && answeredQuestions) {
      const progress = JSON.parse(hasUnsavedData);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/users/updateStats`;
      const id = triviaUser.id;

      const { data } = await axios.post(url, {
        stats: progress,
        id,
        answeredQuestions: answeredQuestions.split(","),
      } as IUpdateUserStatsRequest);

      if (data === "User stats updated successfully") {
        clearQuestionData()
        reloadPage()
      } else console.log(data);
    }
  }

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
      reloadPage()
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

            <Button
              onClick={discardProgress}
              testid="discard-progress-button"
            >
              Discard Progress
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
