"use client";

import { GlobalContext } from "@/context/globalContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import useGameStore from "../game/components/store";

interface IFetchQuestionsProps {
  categories: string;
  difficulty: string;
}

export default function useFetchQuestions({
  difficulty,
  categories,
}: IFetchQuestionsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = baseUrl + "questions/play";
  const { setQuestions } = useGameStore();
  const {
      storageIsAvailable,
      newFilters,
      triviaUser: user,
    } = useContext(GlobalContext),
    [enabled, setEnabled] = useState(false);

  // check for previous set filters
  useEffect(() => {
    // fetch new questions for users without local storage
    if (!storageIsAvailable) {
      setEnabled(true);
      return;
    }

    // check for first time render on client
    const [localDifficulty, localCategories] = [
      localStorage.getItem("difficulty"),
      localStorage.getItem("categories"),
    ];

    if (!localDifficulty && !localCategories) {
      // fetch new questions
      setEnabled(true);

      // set new filters in local storage
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("categories", categories);

      return;
    }

    // fetch new questions if user answered questions updates
    // and game page refreshes
    const invalidateQuestions = localStorage.getItem("fetchNewQuestions"),
      gamePageMounted = localStorage.getItem("gamePageMounted");

    if (invalidateQuestions === "true" && gamePageMounted === "false") {
      setEnabled(true);
      return;
    }

    // check if new filters match
    if (!newFilters) return;

    // fetch new questions
    setEnabled(true);
  }, [categories, difficulty, newFilters, storageIsAvailable]);

  useQuery<TQuestion[]>({
    queryKey: [`fetchQuestions`, difficulty, categories],
    queryFn: async () => {
      try {
        const { data } = await axios.post(url, {
          categories,
          difficulty,
          user,
        });
        console.log(data)

        if (storageIsAvailable)
          localStorage.setItem("questions", JSON.stringify(data));

        setQuestions(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: () => {
      const prevData = storageIsAvailable
        ? (JSON.parse(localStorage.getItem("questions") || "[]") as TQuestion[])
        : ([] as TQuestion[]);
      setQuestions(prevData);
      setQuestions(prevData);
      return prevData;
    },
    enabled,
  });
}
