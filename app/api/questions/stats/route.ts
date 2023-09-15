import storage from '@/models/index'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const data = storage.questionsStats(body?.difficulty || '')

  return NextResponse.json(data)
}