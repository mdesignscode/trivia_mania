"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { setUser, useDispatch } from "@/lib/redux";

export default async function AddUserToStorage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const dispatch = useDispatch();

  if (isLoaded && isSignedIn) {
    // get user from storage
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = baseUrl + "users/";

    try {
      const { data } = await axios.post(url + "get", { id: user.id });
      let triviaUser = data;

      // create user if not exist
      if (!data) {
        try {
          const { data } = await axios.post(url + "create", {
            username: user.username,
            id: user.id,
            avatar: user.imageUrl,
          });

          // api should return the new user
          triviaUser = data.user
        } catch (error) {
          console.log(error);
          return
        }
      }

      // dispatch user
      dispatch(setUser(triviaUser))
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
