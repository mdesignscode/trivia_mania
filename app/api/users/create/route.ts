import storage from "@/models/index";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const username = body.username;
  const id = body.id;
  const avatar = body.avatar;

  const newUser = new User(username, id, {}, avatar);
  try {
    storage.newUser(newUser);

    storage.save();

    NextResponse.json({ message: "User created successfully"})
  } catch (error) {
    NextResponse.json({ message: "Failed to create User"})
  }
}
