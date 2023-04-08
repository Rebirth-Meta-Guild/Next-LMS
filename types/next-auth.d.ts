import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth/jwt" {
  interface JWT {
    metamaskAddress: string
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Add the user's id */
      id: string
      role: string
      metamaskAddress: string
    } & DefaultSession["user"]
  }

  interface DefaultUser {
    metamaskAddress: string
  }
}