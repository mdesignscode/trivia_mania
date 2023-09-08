"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./styledComponents";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";

function HomePage({ stats }: Record<string, any>) {
  const [difficultyStats, setDifficultyStats] = useState<Record<string, number>>({})
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({})
  const [difficultyChoice, setDifficultyChoice] = useState<Array<boolean>>([false, false, false])
  const [categoryChoice, setCategoryChoice] = useState<Array<boolean>>([false, false, false])

  async function getQuestionStats() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const url = baseUrl + 'questions/stats'

    const { data } = await axios.get(url)
    return data
  }

  const { data } = useQuery({
    queryKey: ['questionsStats'],
    queryFn: getQuestionStats,
    initialData: stats,
  })

  function handleDifficulty(index: number) {
    setDifficultyChoice((state: Array<boolean>) => state.map((_, i) => {
      return i === index ? true : false
    }))
  }

  function handleCategories(index: number) {
    setCategoryChoice((state: Array<boolean>) => {
      const newState = [...state]
      newState[index] = true
      return newState
    })
  }

  // get questions stats
  useEffect(() => {
    for (const key in stats) {
      // set difficulty stats
      if (['easy', 'medium', 'hard', 'all difficulties'].includes(key)) {
        setDifficultyStats(state => ({
          ...state,
          [key]: stats[key]
        }))
      } else {
        // set categories stats
        setCategoryStats(state => ({
          ...state,
          [key]: stats[key]
        }))
      }
    }
  }, [])

  return (
    <div className="homepage flex flex-col">
      <main className="main-content flex-col items-center flex">
        <div className="mb-4 mt-5">
          <h2 className="text-3xl mb-2 font-bold underline">Welcome to Trivia Mania!</h2>
          <p>Test your knowledge with exciting trivia questions.</p>
        </div>

        <div className="text-center flex flex-col gap-4">
          <div className="text-center flex flex-col gap-3">
            <h1>Choose difficulty</h1>

            <div className="flex gap-2 justify-center">
              {Object.keys(difficultyStats).map((stat, i) => {
                return <Button key={stat} onClick={() => handleDifficulty(i)} $primary={difficultyChoice[i]}>
                  {stat} ({difficultyStats[stat]})
                </Button>
              })}
            </div>
          </div>

          <div className="text-center flex flex-col gap-3">
            <h1>Choose Categories</h1>

            <div className="flex gap-2 flex-wrap justify-center">
              {Object.keys(categoryStats).map((stat, i) => {
                return <Button key={stat} onClick={() => handleCategories(i)} $primary={categoryChoice[i]}>
                  {stat} ({categoryStats[stat]})
                </Button>
              })}
            </div>
          </div>
        </div>

        <Link className="start-button mt-4" href="/game">
          Start Playing
        </Link>
      </main>

      <footer className="footer w-full py-4 flex justify-center mt-5">
        <p>&copy; 2023 Trivia Mania. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
