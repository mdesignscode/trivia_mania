import { IPlayRequest, PlayRequest } from "@/models/customRequests";
import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: PlayRequest) {
  const body: IPlayRequest = await request.json();

  const difficulty = body.difficulty || "";
  const categories = body.categories || [];
  const userId = body.userId || "";

  const data = storage.filterQuestions({ difficulty, categories }, userId);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
