"use client";

import { useUser } from "@clerk/nextjs";
import { GlobalContext } from "app/store";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

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
  const { user, isLoaded, isSignedIn } = useUser();
  const { storageIsAvailable } = useContext(GlobalContext);

  // request body
  let reqBody = {
    difficulty: "",
    userId: "",
  };

  async function fetchInitialQuestionStats() {
    // wait for clerk to finish loading
    if (isLoaded) {
      // if user is available
      if (isSignedIn) {
        // add user id to request body
        reqBody.userId = user.id;

        // check for previous difficulty set
        if (storageIsAvailable) {
          const prevDiff = localStorage.getItem("difficulty");
          if (prevDiff) {
            // add difficulty to request body
            reqBody.difficulty = prevDiff;
          }
        }
      }

      try {
        // prepare url for question stats
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = baseUrl + "questions/stats";

        // fetch initial questions stats
        // get categories based on difficulty
        const { data } = await axios.post(url, reqBody);
        // get difficulty stats, which is not included above
        const { data: diffStats } = await axios.post(url, { userId: reqBody.userId });

        const difficultyStats: TStat = {};
        const categoryStats: TStat = {};

        for (const key in data) {
          // set categories stats
          categoryStats[key] = data[key];
        }

        for (const key in diffStats) {
          // set difficulty stats
          if (["easy", "medium", "hard", "all difficulties"].includes(key)) {
            difficultyStats[key] = diffStats[key];
          }
        }

        setInitialStats({
          difficultyStats,
          categoryStats,
          categoriesLoading: false,
          previousDifficulty: reqBody.difficulty,
          difficultiesLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchInitialQuestionStats();
  }, [isLoaded, isSignedIn, storageIsAvailable]);

  return initialStats;
}
