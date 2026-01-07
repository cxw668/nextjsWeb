import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {

  providers: [
   CredentialsProvider({
  
    name: "Credentials",
   
    credentials: {
      username: { label: "Username", type: "text", placeholder: "admin" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      if(!credentials) return null
      const { username, password } = credentials as { username: string; password: string };
      if(username !== "admin" || password !== "123456") {
        return null
      }
      return {
        ...credentials,
        id: '1',
      }
    }
  })

  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }