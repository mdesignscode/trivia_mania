import storage from "../../../../models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      body.difficulty &&
      !["easy", "hard", "medium"].includes(body.difficulty)
    ) {
      return NextResponse.json("Invalid difficulty");
    }

    const data = storage.questionsStats(body?.difficulty || "");

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
