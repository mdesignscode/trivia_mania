import { TStatsRequest, StatsRequest } from "@/models/customRequests";
import storage from "@/models/index";

export function OPTIONS() {
  const headers = {
    'Allow': 'POST',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*'
  };

  const response = new Response(null, {
    status: 200,
    headers: headers
  });

  return response;
}

export async function POST(request: StatsRequest) {
  const body: TStatsRequest = await request.json();
  let data: Record<string, number>;

  if (body.recordType === "difficulties") {
    data = storage.questionsStats("difficulties", body.userId);
  } else {
    data = storage.questionsStats("categories", body.difficulty, body.userId);
  }

  return new Response(JSON.stringify(data), {
    status: 200
  })
}
