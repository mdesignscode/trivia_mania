import storage from "../../../../models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json("User id required");
    }

    const id = body.id;

    const user = storage.getUser(id) || null;
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
