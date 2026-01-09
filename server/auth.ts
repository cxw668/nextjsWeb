import { AuthOptions } from "next-auth";
import GitLabProvider from "next-auth/providers/gitlab";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db/db";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GitLabProvider({
      clientId: process.env.GITLAB_CLIENT_ID || 'c618894549f6abf8ccf6bfca45e61138ec09db9f6a05387c1c2b334e35f7b4a9',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || 'gloas-5ebd9d157f6b9b1874e9d241d717303f679ece57cf29f0c23f561814cb55ce91',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  debug: process.env.NODE_ENV === "development",
};
