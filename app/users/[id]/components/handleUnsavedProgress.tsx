"use client";
import { Button } from "@/components/styledComponents";
import { IUser } from "@/models/interfaces";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { userAgent } from "next/server";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function HandleUnsavedProgress() {
  const { user } = useUser();
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);

  async function saveProgress() {
    const hasUnsavedData = localStorage.getItem("unsavedData");
    if (hasUnsavedData && user) {
      setHasUnsavedProgress(true);
      const progress = JSON.parse(hasUnsavedData);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/users/updateStats`;
      const id = user.id;
      localStorage.setItem("unsavedData", "{}");

      try {
        const { data } = await axios.post(url, { stats: progress, id });
        return data;
      } catch (error) {
        return error;
      }
    }
  }

  return (
    hasUnsavedProgress && (
      <div>
        <h1>You have unsaved progress.</h1>

        <Button type="submit" onClick={saveProgress} $primary={true}>
          Save progress
        </Button>
      </div>
    )
  );
}
