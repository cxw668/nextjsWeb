'use client'

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";

export function UserInfo() {
  const session = useSession();
  console.log(session)
  if (!session) {
    return null;
  }
  return (
    <div>
      <p>Welcome, {session.data?.user?.name}!</p>
    </div>
  );
}

export function SessionProvider(props:any){
  return (
    <NextAuthSessionProvider {...props} />
  )
}