"use client";
import { useSearchParams } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Question from '@/models/question';
import QuestionComponent, { IQuestionProps } from '@/components/question';
import { useEffect } from 'react';
import { IQuestion } from '@/models/interfaces';

export default function GamePage() {
  const params = useSearchParams()

  const difficulty = params.get('difficulty')
  const categories = params.get('categories')

  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const url = `${baseUrl}questions/play?difficulty=${difficulty}&categories=${categories}`

    const { data } = await axios.get(url)
    return data
  }
  
  const { data } = useQuery({
    queryKey: ['play'],
    queryFn: getQuestions,
    initialData: []
  })

  return (
    <div className="game-page h-full flex-1">
      <div className="w-3/5 h-6/12 h-full mx-auto">
        {data 
        ? data.map((question: IQuestion) => {
          return <QuestionComponent questionObj={question} />
        })
        : <h1>Loading...</h1>
        }
      </div>
    </div>
  );
}