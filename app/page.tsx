import { UserForm } from "@/components/UserForm";
import { UserInfo, SessionProvider } from "@/components/UserInfo";
import { Accounts } from "@/components/Accounts";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8 gap-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <UserForm />
        <Accounts />
      </div>
      <SessionProvider>
        <UserInfo></UserInfo>
      </SessionProvider>
    </div>
  );
}
