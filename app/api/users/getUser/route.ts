import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json("User id required");
    }

    const id = body.id;

    try {
      return NextResponse.json(storage.getUser(id));
    } catch (error) {
      return NextResponse.json("Failed to update user stats");
    }
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
