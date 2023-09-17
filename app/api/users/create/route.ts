import storage from "../../../../models/index";
import User from "../../../../models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

      if (!body.username) {
      return NextResponse.json("Username required");
    }

    const username = body.username;
    const id = body.id;
    const avatar = body.avatar;

    const newUser = new User(username, id, {}, avatar);
    try {
      storage.newUser(newUser);

      storage.save();

      return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Failed to create User" });
    }
  } catch (error) {
    return NextResponse.json("Invalid body");
  }
}
