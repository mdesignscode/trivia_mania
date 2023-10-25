import { GetUserRequest, IGetUserRequest } from "@/models/customRequests";
import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: GetUserRequest) {
  const body: IGetUserRequest = await request.json();
  const id = body.id;
  return NextResponse.json(storage.getUser(id));
}
