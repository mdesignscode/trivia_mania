import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const id = body.id;

  const user = storage.getUser(id) || null
  return NextResponse.json(user)
}
