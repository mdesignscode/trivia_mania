import storage from "@/models/index";

export async function POST(request: Request) {
  const body = await request.json();

  const stats = body.stats;
  const id = body.id;

  storage.updateUserProgress(id, stats);
}
