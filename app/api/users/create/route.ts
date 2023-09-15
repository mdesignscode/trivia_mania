import storage from "@/models/index";
import User from "@/models/user";

export async function POST(request: Request) {
  const body = await request.json();

  const username = body.username;
  const id = body.id;

  const newUser = new User(username, id);
  storage.newUser(newUser);

  storage.save();
}
