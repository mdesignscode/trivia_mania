import { IUpdateUserStatsRequest, UpdateUserStatsRequest } from "@/models/customRequests";
import storage from "@/models/index";
import { NextResponse } from "next/server";

export async function POST(request: UpdateUserStatsRequest) {
  const { stats, id, answeredQuestions } = await request.json() as IUpdateUserStatsRequest;

  try {
    storage.updateUserProgress(id, stats, answeredQuestions);
    return NextResponse.json("User stats updated successfully");
  } catch (error: any) {
    throw new Error("An error hass occured", error.message)
  }
}
