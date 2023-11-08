"use client";

import { GlobalContext } from "@/app/context/globalContext";
import { TStatsRequest } from "@/models/customRequests";
import { CATEGORIES } from "@/utils/localStorage_utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";

type TStat = Record<string, number>;
export interface IInitialStats {
  difficultyStats: TStat;
  categoryStats: TStat;
  categoriesLoading: boolean;
  difficultiesLoading: boolean;
}

export default function useInitialStats(): IInitialStats {
  const [initialStats, setInitialStats] = useState<IInitialStats>({
    difficultyStats: {},
    categoryStats: {},
    categoriesLoading: true,
    difficultiesLoading: true,
  });
  const {
    storageIsAvailable,
    triviaUser,
    setCategoryChoice,
    playFilters: { difficulty }
  } = useContext(GlobalContext);

  const [shouldFetchCategories, setShouldFetchCategories] = useState(false);
  const [shouldFetchDifficulties, setShouldFetchDifficulties] = useState(false);

  // prepare url for question stats
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = baseUrl + "questions/stats";

  // fetch category stats
  const { data: categoryStats, isFetched: fetchedCategories } = useQuery<
    Record<string, number>
  >({
    queryKey: ["categoryStats", triviaUser],
    queryFn: async () => {
      try {
        const { data } = await axios.post(url, {
          recordType: "categories",
          difficulty: difficulty,
          userId: triviaUser?.id,
        } as TStatsRequest);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: {},
    enabled: shouldFetchCategories,
  });

  // fetch difficulty stats
  const { data: difficultyStats, isFetched: fetchedDifficulties } = useQuery<
    Record<string, number>
  >({
    queryKey: ["difficultyStats", triviaUser],
    queryFn: async () => {
      try {
        const { data } = await axios.post(url, {
          recordType: "difficulties",
          userId: triviaUser?.id,
        } as TStatsRequest);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    initialData: {},
    enabled: shouldFetchDifficulties,
  });

  const getStats = useCallback(() => {
    // fetch difficulties
    setShouldFetchDifficulties(true);
    if (fetchedDifficulties) {
      setInitialStats((state) => ({
        ...state,
        difficultyStats,
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
  }, [categoryStats, difficultyStats, fetchedCategories, fetchedDifficulties]);

  // fetch stats
  useEffect(() => {
    getStats();
  }, [getStats]);

  // set previous categories if available
  useEffect(() => {
    if (storageIsAvailable && Object.keys(categoryStats).length) {
      const prevCategories = localStorage.getItem(CATEGORIES);

      if (prevCategories) {
        const preferences = prevCategories.split(",");

        if (preferences.length > 0) {
          const newState: Record<string, boolean> = {};
          Object.keys(categoryStats)
            .sort()
            .forEach((category) => {
              newState[category] = preferences.includes(category)
                ? true
                : false;
            });

          setCategoryChoice(Object.values(newState));
        }
      }
    }
  }, [categoryStats, setCategoryChoice, storageIsAvailable]);

  return initialStats;
}
