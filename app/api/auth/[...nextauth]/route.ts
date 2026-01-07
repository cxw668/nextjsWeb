import NextAuth, {AuthOptions} from "next-auth"
import GitLabProvider from "next-auth/providers/gitlab"
import Auth0Provider from "next-auth/providers/auth0"
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db/db";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GitLabProvider({
      clientId: process.env.GITLAB_CLIENT_ID || 'c618894549f6abf8ccf6bfca45e61138ec09db9f6a05387c1c2b334e35f7b4a9',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || 'gloas-5ebd9d157f6b9b1874e9d241d717303f679ece57cf29f0c23f561814cb55ce91',
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }