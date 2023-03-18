import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import GooogleProvider from "next-auth/providers/google";
import { OAuth2Client } from 'google-auth-library'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "utils/prisma"



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GooogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id
      }

      return session
    }
  }
}

export default NextAuth(authOptions)