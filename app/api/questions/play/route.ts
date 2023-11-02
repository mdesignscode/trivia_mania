import { IPlayRequest, PlayRequest } from "@/models/customRequests";
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

export async function POST(request: PlayRequest) {
  const body: IPlayRequest = await request.json();

  const difficulty = body.difficulty || "";
  const categories = body.categories || [];
  const userId = body.userId || "";

  const data = storage.filterQuestions({ difficulty, categories }, userId);

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
