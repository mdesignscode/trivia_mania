import storage from "@/models/index";
import Navbar from "./navigation";

export default async function Navigation() {
  const users = JSON.stringify(storage.getAllUsers())
  return <Navbar serializedUsers={users} />
}
