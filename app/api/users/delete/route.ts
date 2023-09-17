import storage from "../../../../models/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json("User id required");
    }

    const id = body.id;
    try {
      storage.deleteUser(id);

      storage.save();

      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Failed to delete User" });
    }
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
