"use client";
import { Button } from "@/components/styledComponents";
import { useUser } from "@clerk/nextjs";
import { GlobalContext } from "app/store";
import axios from "axios";
import { useContext, useState } from "react";

export default function HandleUnsavedProgress() {
  const { user } = useUser();
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const { storageIsAvailable } = useContext(GlobalContext);

  async function saveProgress() {
    if (storageIsAvailable) {
      const hasUnsavedData = localStorage.getItem("unsavedData");
      const answeredQuestions = localStorage.getItem("answeredQuestions");
      if (hasUnsavedData && user && answeredQuestions) {
        setHasUnsavedProgress(true);
        const progress = JSON.parse(hasUnsavedData);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${baseUrl}/users/updateStats`;
        const id = user.id;

        try {
          const { data } = await axios.post(url, {
            stats: progress,
            id,
            answeredQuestions,
          });
          localStorage.removeItem("unsavedData");
          localStorage.setItem("hasUnsavedData", "false");
          localStorage.removeItem("questionsList")
          localStorage.removeItem("questionsPool")
          localStorage.removeItem("poolIndex")
          localStorage.removeItem("currentIndex")
          localStorage.removeItem("answeredQuestions")
          return data;
        } catch (error) {
          return error;
        }
      }
    }
  }

  function discardProgress() {
    if (storageIsAvailable) {
      localStorage.removeItem("unsavedData");
      localStorage.setItem("hasUnsavedData", "false");
    }
  }

  return (
    hasUnsavedProgress && (
      <div>
        <h1>You have unsaved progress.</h1>

        <div className="flex gap-4">
          <Button type="submit" data-testid="save-progress-button" onClick={saveProgress} $primary={true}>
            Save progress
          </Button>

          <Button type="submit" onClick={discardProgress}>
            Discard Progress
          </Button>
        </div>
      </div>
    )
  );
}
