import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import GooogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "utils/prisma"

import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { NextApiRequest } from "next"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GooogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: {} as NextApiRequest }),
          })

          if (result.success) {
            const findUser = await prisma.user.findFirst({
              where: { metamaskAddress: siwe.address }
            })
            if (findUser == null) {
              const createUser = await prisma.user.create({
                data: { metamaskAddress: siwe.address },
              })

              return {
                id: createUser.id,
                name: createUser.name,
                email: createUser.email,
                metamaskAddress: siwe.address
              }
            } 
            else {
              return {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                metamaskAddress: siwe.address
              }
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const prismauser = await prisma.user.findUnique({
          where: {
            id: token.sub
          }
        })
        if (!prismauser) {
          throw new Error('User not found')
        }
        session.user.id = prismauser.id
        session.user.role = prismauser.role
        session.user.email = prismauser.email
        session.user.metamaskAddress = prismauser.metamaskAddress as string
      }

      return session
    }
  }
}

export default NextAuth(authOptions)