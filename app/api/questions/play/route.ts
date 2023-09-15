import storage from '@/models/index'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const difficulty = body.difficulty || ''
  const categories = body.categories || []

  const data = storage.filterQuestions({ difficulty, categories })

  return NextResponse.json(data)
}