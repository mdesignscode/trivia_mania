import { IPlayRequest, PlayRequest } from "@/models/customRequests";
import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: PlayRequest) {
  const body: IPlayRequest = await request.json();

  const difficulty = body.difficulty || "";
  const categories = body.categories || [];
  const userId = body.userId || "";

  const data = storage.filterQuestions({ difficulty, categories }, userId);

  return NextResponse.json(data);
}
