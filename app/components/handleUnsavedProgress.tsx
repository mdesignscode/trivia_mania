"use client";
import { Button } from "@/components/styledComponents";
import { GlobalContext } from "@/app/store";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import reloadPage from "./reloadPage";

export default function HandleUnsavedProgress() {
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const {
    storageIsAvailable,
    userStatus: { user },
  } = useContext(GlobalContext);

  async function saveProgress() {
    const hasUnsavedData = localStorage.getItem("unsavedData");
    const answeredQuestions = localStorage.getItem("answeredQuestions");

    if (hasUnsavedData && user && answeredQuestions) {
      const progress = JSON.parse(hasUnsavedData);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/users/updateStats`;
      const id = user.id;

      const { data } = await axios.post(url, {
        stats: progress,
        id,
        answeredQuestions: answeredQuestions.split(","),
      });

      if (data === "User stats updated successfully") {
        localStorage.removeItem("unsavedData");
        localStorage.setItem("hasUnsavedData", "false");
        localStorage.removeItem("questionsList");
        localStorage.removeItem("questionsPool");
        localStorage.removeItem("poolIndex");
        localStorage.removeItem("currentIndex");
        localStorage.removeItem("answeredQuestions");
        reloadPage()
      } else console.log(data);
    }
  }

  useEffect(() => {
    if (storageIsAvailable) {
      const hasUnsavedData = localStorage.getItem("unsavedData");

      if (hasUnsavedData) {
        setHasUnsavedProgress(true);
      }
    }
  }, [storageIsAvailable]);

  function discardProgress() {
    if (storageIsAvailable) {
      localStorage.removeItem("unsavedData");
      localStorage.setItem("hasUnsavedData", "false");
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
              type="submit"
              data-testid="save-progress-button"
              onClick={saveProgress}
              $primary={true}
            >
              Save progress
            </Button>

            <Button
              type="submit"
              onClick={discardProgress}
              data-testid="discard-progress-button"
            >
              Discard Progress
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
