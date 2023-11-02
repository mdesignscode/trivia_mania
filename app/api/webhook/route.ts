import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import storage from "@/models/index";
import User from "@/models/user";
import { initialStat } from "@/models/interfaces";

export function OPTIONS() {
  const headers = {
    'Allow': 'POST',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  const response = new Response(null, {
    status: 200,
    headers: headers
  });

  return response;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  let response = "An error occured";
  const { id, username, imageUrl } = payload.data;

  switch (eventType) {
    // handle signup
    case "user.created":
      // create new user
      const newUser = new User(username, id, initialStat, imageUrl);

      storage.newUser(newUser);
      response = `${id} created`;
      break;

    // handle delete
    case "user.deleted":
      storage.deleteUser(id);
      response = `${id} deleted`;
      break;

    // handle update
    case "user.updated":
      const userStats = storage.getUserStats(id);
      const updatedUser = new User(username, id, userStats, imageUrl);
      storage.newUser(updatedUser);
      response = `${id} updated`;
      break;

    default:
      break;
  }

  // save changes
  storage.save();

  return new Response(response, {
    status: response === "An error occured" ? 500 : 201,
  })
}
