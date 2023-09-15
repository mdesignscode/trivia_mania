import User from "@/models/user";
import Loading from "app/loading";
import Image from "next/image";

export default function Board({ topTenUsers }: { topTenUsers: Array<User> }) {
  return (
    <div>
      <h1>Top ten users</h1>

      <div>
        {topTenUsers.map((user) => {
          return <div>
            <Image width={128} height={128} src={user.avatar} alt="User avatar" />
            <h2>{user.username}</h2>
          </div>
        })}
      </div>
    </div>
  );
}
