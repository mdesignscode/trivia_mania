import storage from "../../../../models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json("User id required");
    }

    if (!body.stats) {
      return NextResponse.json("New stats required");
    }

    if (!body.answeredQuestions) {
      return NextResponse.json("Questions answered required");
    }

    const stats = body.stats;
    const id = body.id;
    const answeredQuestions = body.answeredQuestions;

    try {
      storage.updateUserProgress(id, stats, answeredQuestions);
      return NextResponse.json("User stats updated successfully");
    } catch (error) {
      return NextResponse.json("Failed to update user stats");
    }
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
