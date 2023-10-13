import storage from "@/models/index";
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

    if (body.categories && !Array.isArray(body.categories)) {
      return NextResponse.json("Invalid categories");
    }

    const difficulty = body.difficulty || "";
    const categories = body.categories || [];
    const userId = body.userId || "";

    const data = storage.filterQuestions({ difficulty, categories }, userId);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
