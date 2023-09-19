"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default async function AddUserToStorage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (isLoaded && isSignedIn) {
    // get user from storage
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = baseUrl + "users/";

    try {
      const { data } = await axios.post(url + "get", { id: user.id });

      // create user if not exist
      if (!data) {
        axios
          .post(url + "create", {
            username: user.username,
            id: user.id,
            avatar: user.imageUrl,
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
