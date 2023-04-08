import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { User } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<User | null>) {
  const { method } = req
  const { id: id } = req.query
  if (typeof id !== "string") { throw new Error('missing id') };

  switch (method) {
    case 'PUT':
      try {
        const { name, email } = JSON.parse(req.body)
        const session = await getServerSession(req, res, authOptions)
        if (!session) res.status(401).end();

        const id = session?.user?.id
        if (!id) throw Error("Cannot update user: access denied")

        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        })

        if (!user) {
          res.status(401).end();
        }

        const updateUser = await prisma.user.update({
          where: {
            id: id
          },
          data: {
            name: name,
            email: email
          },
        })

        res.status(200).json(updateUser)

      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break;

    case 'PATCH':
      try {
        const { role } = JSON.parse(req.body)
        const session = await getServerSession(req, res, authOptions)
        if (!session) res.status(401).end();

        const userId = session?.user?.id
        if (!userId) throw Error("Cannot update user: access denied")

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          res.status(401).end();
        }
        else if (user.role != "admin") {
          res.status(401).end();
        }

        const updateUser = await prisma.user.update({
          where: {
            id: id
          },
          data: {
            role: role
          },
        })

        res.status(200).json(updateUser)

      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}