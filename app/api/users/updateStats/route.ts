import { IUpdateUserStatsRequest, UpdateUserStatsRequest } from "@/models/customRequests";
import storage from "@/models/index";

export function OPTIONS() {
  const headers = {
    'Allow': 'POST',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin ': '*'
  };

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
