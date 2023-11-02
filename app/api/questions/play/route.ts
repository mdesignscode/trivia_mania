import { IPlayRequest, PlayRequest } from "@/models/customRequests";
import storage from "@/models/index";

export function OPTIONS() {
  const headers = new Headers();

  // Set the CORS headers to allow any origin, methods, and headers
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

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
