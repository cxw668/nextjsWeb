import { UserForm } from "@/components/UserForm";
import { UserInfo, SessionProvider } from "@/components/UserInfo";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8 gap-8">
      <UserForm />
      <SessionProvider>
        <UserInfo></UserInfo>
      </SessionProvider>
    </div>
  );
}
