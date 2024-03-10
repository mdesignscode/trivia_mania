import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { PrismaClient } from "prisma/generated/client";
import { Webhook } from "svix";

const prisma = new PrismaClient()

export function OPTIONS() {
  const headers = new Headers();

  // Set the CORS headers to allow any origin, methods, and headers
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

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
  const { id, username, image_url } = payload.data;

  // pass test user
  if (id === "test_id") return new Response(null, { status: 201 })

  switch (eventType) {
    // handle signup
    case "user.created":
      // create new user
      await prisma.user.create({
        data: {
          id,
          username,
          avatar: image_url,
          correctAnswered: 0,
          easyStats: {
            create: {}
          },
          mediumStats: {
            create: {}
          },
          hardStats: {
            create: {}
          }
        }
      })

      response = `${id} created`;
      break;

    // handle delete
    case "user.deleted":
      await prisma.user.delete({
        where: {
          id
        }
      })
      response = `${id} deleted`;
      break;

    // handle update
    case "user.updated":
      await prisma.user.update({
        where: { id },
        data: { username, avatar: image_url }
      })
      response = `${id} updated`;
      break;

    default:
      break;
  }

  return new Response(response, {
    status: response === "An error occured" ? 500 : 201,
  })
}
