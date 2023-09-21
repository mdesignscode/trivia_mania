import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import storage from "@/models/index";
import User from "@/models/user";

export async function POST() {
  try {
    const clerkUsers = await clerkClient.users.getUserList();
    const myUsers = storage.getAllUsers();
    const newUsers: Record<string, User> = {};

    // traverse clerk users
    clerkUsers.forEach(({ id, username, imageUrl }) => {
      const myUser = myUsers[id];

      // create new user locally
      const newUser = new User(
        username as string,
        id as string,
        myUser ? myUser.stats : {},
        imageUrl as string
      );

      newUsers[id] = newUser;
    });

    // update local users
    storage.syncUsers(newUsers);

    // save changes
    storage.save();

    return NextResponse.json({
      message: "Trivia Mania storage synced with Clerk.js",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to sync",
    });
  }
}
