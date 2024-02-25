"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { GlobalContext } from "../context/globalContext";

interface ISubmitAnsweredQuestionProps {
  answeredCorrect: boolean;
  question: TQuestion;
}

interface IUpdateStatsBody {
  user: NonNullable<TUser>;
  answeredCorrect: boolean;
  question: TQuestion;
}

export default function useSubmitAnsweredQuestion({
  answeredCorrect,
  question,
}: ISubmitAnsweredQuestionProps) {
  const { triviaUser } = useContext(GlobalContext);
  const [shouldSubmit, setshouldSubmit] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = baseUrl + "users/updateStats";

  const {} = useQuery({
    queryKey: [`submitQuestion-${triviaUser?.id}-${question.id}`],
    queryFn: async () => {
      const postBody: IUpdateStatsBody = {
        user: triviaUser as NonNullable<TUser>,
        question,
        answeredCorrect,
      };
      try {
        const { data } = await axios.post(url, postBody);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: shouldSubmit,
    onSuccess: () => setshouldSubmit(false)
  });

  return { setshouldSubmit };
}
