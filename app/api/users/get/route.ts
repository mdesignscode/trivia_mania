import { GetUserRequest, IGetUserRequest } from "@/models/customRequests";
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

export async function POST(request: GetUserRequest) {
  const body: IGetUserRequest = await request.json();
  const id = body.id;

  return new Response(JSON.stringify(storage.getUser(id)), {
    status: 200,
  })
}
