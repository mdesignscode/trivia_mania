"use client";
import { Button } from "@/components/styledComponents";
import { progressSelector } from "@/lib/redux/slices/progressSlice";
import { userSelector } from "@/lib/redux/slices/userSlice";
import { IUser } from "@/models/interfaces";
import axios from "axios";
import { useSelector } from "react-redux";

export default function HandleUnsavedProgress() {
  const { user } = useSelector(userSelector);
  const { hasUnsavedData } = useSelector(progressSelector);

  async function saveProgress() {
    const hasUnsavedData = localStorage.getItem("unsavedData");
    if (hasUnsavedData) {
      const progress = JSON.parse(hasUnsavedData);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/users/updateStats`;
      const id = (user as IUser).id;
      localStorage.setItem("unsavedData", "{}")

      try {
        const { data } = await axios.post(url, { stats: progress, id });
        return data;
      } catch (error) {
        return error;
      }
    }
  }

  return (
    hasUnsavedData && (
      <div>
        <h1>You have unsaved progress.</h1>

        <Button type="submit" onClick={saveProgress} $primary={true}>
          Save progress
        </Button>
      </div>
    )
  );
}
