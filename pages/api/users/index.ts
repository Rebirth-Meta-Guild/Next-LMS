import { prisma } from 'utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function usersHandler(req: NextApiRequest, res: NextApiResponse<User[]>) {
  const { method } = req
  const session = await getServerSession(req, res, authOptions)
  if (!session) res.status(401).end();

  if (!session) {
    res.status(401).end();
    return;
  }

  if (session.user.role !== 'admin') {
    res.status(403).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (e) {
    console.error('Request error', e);
    res.status(500).end();
  }
}
