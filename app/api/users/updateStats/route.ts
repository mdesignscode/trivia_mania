import { IUpdateUserStatsRequest, UpdateUserStatsRequest } from "@/models/customRequests";
import storage from "@/models/index";

export async function POST(request: UpdateUserStatsRequest) {
  const { stats, id, answeredQuestions } = await request.json() as IUpdateUserStatsRequest;

  try {
    storage.updateUserProgress(id, stats, answeredQuestions);

    return new Response("User stats updated successfully", {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    throw new Error("An error hass occured", error.message)
  }
}
