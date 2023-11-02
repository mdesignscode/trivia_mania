import { IUpdateUserStatsRequest, UpdateUserStatsRequest } from "@/models/customRequests";
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

export async function POST(request: UpdateUserStatsRequest) {
  const { stats, id, answeredQuestions } = await request.json() as IUpdateUserStatsRequest;

  try {
    storage.updateUserProgress(id, stats, answeredQuestions);

    return new Response("User stats updated successfully", {
      status: 200,
    })
  } catch (error: any) {
    throw new Error("An error hass occured", error.message)
  }
}
