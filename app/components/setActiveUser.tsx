"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GlobalContext } from "../context/globalContext";
import { useContext } from "react";
import { currentUser } from "@clerk/nextjs";

export default function SetActiveUser({ user: userStr }: { user: string }) {
  const { setTriviaUser } = useContext(GlobalContext),
    user: NonNullable<Awaited<ReturnType<typeof currentUser>>> =
      JSON.parse(userStr);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = baseUrl + "users/get";

  const {} = useQuery<TUser>({
    queryKey: [`getUser-${user.id}`, user.id],
    queryFn: async () => {
      const { data } = await axios.post(url, { id: user.id });

      setTriviaUser(data);

      return data;
    },
    onError: (error) => console.log(error)
  });

  return <></>;
}
