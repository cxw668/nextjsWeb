import { db } from "@/server/db/db";
import { user as userSchema } from "@/server/db/schema";
import { UserActions } from "./UserActions";

export async function Accounts() {
  const allUsers = await db.select().from(userSchema);

  return (
    <div className="w-full max-w-md p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Accounts</h2>
      {allUsers.length === 0 ? (
        <p className="text-zinc-500">No users found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {allUsers.map((user) => (
            <div key={user.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-zinc-500">{user.hobby || "No hobby"}</p>
                </div>
              </div>
              <UserActions user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
