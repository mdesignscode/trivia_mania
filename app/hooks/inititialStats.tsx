"use client";

import { GlobalContext } from "@/app/store";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";

type TStat = Record<string, number>;
export interface IInitialStats {
  difficultyStats: TStat;
  categoryStats: TStat;
  categoriesLoading: boolean;
  difficultiesLoading: boolean;
  previousDifficulty: string;
}

export default function useInitialStats(): IInitialStats {
  const [initialStats, setInitialStats] = useState<IInitialStats>({
    difficultyStats: {},
    categoryStats: {},
    categoriesLoading: true,
    difficultiesLoading: true,
    previousDifficulty: "",
  });
  const {
    storageIsAvailable,
    userStatus: { user, isOnline, isLoaded },
  } = useContext(GlobalContext);

  // request body
  const [requestBody, setRequestBody] = useState({
    difficulty: "",
    userId: "",
  });
  const [shouldFetchCategories, setShouldFetchCategories] = useState(false);
  const [shouldFetchDifficulties, setShouldFetchDifficulties] = useState(false);

  // Create a client
  const queryClient = new QueryClient();

  // prepare url for question stats
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = baseUrl + "questions/stats";

  // fetch category stats
  const { data: categoryStats, isFetched: fetchedCategories } = useQuery({
    queryKey: ["categoryStats", requestBody.userId],
    queryFn: async () => {
      try {
        const { data } = await axios.post(url, requestBody);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: {},
    enabled: shouldFetchCategories,
  });

  // fetch difficulty stats
  const { data: difficultyStats, isFetched: fetchedDifficulties } = useQuery({
    queryKey: ["difficultyStats", requestBody.userId],
    queryFn: async () => {
      try {
        const { data } = await axios.post(url, { userId: requestBody.userId });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: {},
    enabled: shouldFetchDifficulties,
  });

  function prepareRequestBody() {
    // check for previous difficulty set
    if (storageIsAvailable) {
      const prevDiff = localStorage.getItem("difficulty");
      if (prevDiff) {
        // add difficulty to request body
        setRequestBody((state) => ({
          ...state,
          difficulty: prevDiff,
        }));
      }
    }

    // if user is available
    if (isOnline && user) {
      // add user id to request body
      setRequestBody((state) => ({
        ...state,
        userId: user.id,
      }));
    }
  }

  function getStats() {
    // fetch difficulties
    setShouldFetchDifficulties(true);
    if (fetchedDifficulties) {
      setInitialStats((state) => ({
        ...state,
        difficultyStats,
        previousDifficulty: requestBody.difficulty,
        difficultiesLoading: false,
      }));
      setShouldFetchDifficulties(false);
    }

    // fetch categories
    setShouldFetchCategories(true);
    if (fetchedCategories) {
      setInitialStats((state) => ({
        ...state,
        categoryStats,
        categoriesLoading: false,
      }));
      setShouldFetchCategories(false);
    }
  }

  // prepare request body
  useEffect(() => {
    // wait for user status to be updated
    if (isLoaded) {
      prepareRequestBody();
    }
  }, [isLoaded, isOnline, storageIsAvailable]);

  // fetch stats
  useEffect(() => {
    getStats();

    if (requestBody.userId) {
      queryClient.invalidateQueries({ queryKey: ["difficultyStats"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
    }
  }, [fetchedCategories, fetchedDifficulties, requestBody]);

  return initialStats;
}
