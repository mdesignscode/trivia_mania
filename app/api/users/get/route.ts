import { GetUserRequest, IGetUserRequest } from "@/models/customRequests";
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

export async function POST(request: GetUserRequest) {
  const body: IGetUserRequest = await request.json();
  const id = body.id;

  return new Response(JSON.stringify(storage.getUser(id)), {
    status: 200,
  })
}
