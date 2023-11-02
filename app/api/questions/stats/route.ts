import { TStatsRequest, StatsRequest } from "@/models/customRequests";
import storage from "@/models/index";

export async function POST(request: StatsRequest) {
  const body: TStatsRequest = await request.json();
  let data: Record<string, number>;

  if (body.recordType === "difficulties") {
    data = storage.questionsStats("difficulties", body.userId);
  } else {
    data = storage.questionsStats("categories", body.difficulty, body.userId);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
