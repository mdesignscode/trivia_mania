import { TStatsRequest, StatsRequest } from "@/models/customRequests";
import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: StatsRequest) {
  const body: TStatsRequest = await request.json();
  let data: Record<string, number>;

  if (body.recordType === "difficulties") {
    data = storage.questionsStats("difficulties", body.userId);
  } else {
    data = storage.questionsStats("categories", body.difficulty, body.userId);
  }

  return NextResponse.json(data);
}
