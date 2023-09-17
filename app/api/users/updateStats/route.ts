import storage from "../../../../models/index";
import { NextResponse } from "next/server";
import { stub } from "sinon";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json("User id required");
    }

    if (!body.stats) {
      return NextResponse.json("New stats required");
    }

    const stats = body.stats;
    const id = body.id;

    try {
      storage.updateUserProgress(id, stats);
      return NextResponse.json({ message: "User stats updated successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Failed to update user stats" });
    }
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
