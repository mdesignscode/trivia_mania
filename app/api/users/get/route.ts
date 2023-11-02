import { GetUserRequest, IGetUserRequest } from "@/models/customRequests";
import storage from "@/models/index";

export async function POST(request: GetUserRequest) {
  const body: IGetUserRequest = await request.json();
  const id = body.id;

  return new Response(JSON.stringify(storage.getUser(id)), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
