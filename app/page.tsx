import { UserForm } from "@/components/UserForm";
import { UserInfo, SessionProvider } from "@/components/UserInfo";
import { Accounts } from "@/components/Accounts";
import { ImageUpload } from "@/components/ImageUpload";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-50 font-sans dark:bg-black">
        <SessionProvider>
          <UserInfo></UserInfo>
        </SessionProvider>

        <ImageUpload />

        <div className="flex justify-center items-center gap-10 w-full">
          <UserForm />
          <Accounts />
        </div>


    </div>
  );
}
