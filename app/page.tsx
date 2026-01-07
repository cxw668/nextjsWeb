import { db } from "@/server/db/db";
import { UserForm } from "@/components/UserForm";
import { count } from "drizzle-orm";
import { Users } from "@/server/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserActions } from "@/components/UserActions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [users, [{ total }]] = await Promise.all([
    db.query.Users.findMany({
      limit,
      offset,
      orderBy: (users, { desc }) => [desc(users.id)],
    }),
    db.select({ total: count() }).from(Users),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8 gap-8">
      <UserForm />
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 flex flex-col h-fit">
        <h2 className="text-xl font-bold mb-4">Users List ({total})</h2>
        <div className="flex flex-col gap-2 flex-grow">
          {users?.length > 0 ? (
            users.map(user => (
              <div key={user.id} className="p-3 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.hobby}</p>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase">ID: {user.id}</p>
                  </div>
                  <UserActions user={user} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-center py-4">No users found.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={`/?page=${page - 1}`}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            
            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={`/?page=${page + 1}`}>Next</Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
