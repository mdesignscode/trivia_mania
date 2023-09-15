import storage from "@/models/index";

export async function POST(request: Request) {
  const body = await request.json();

  const id = body.id;

  storage.deleteUser(id);

  storage.save();
}
