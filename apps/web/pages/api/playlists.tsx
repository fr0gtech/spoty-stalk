/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await prisma.playlist.findMany({});

  res.status(200).json({
    data,
  });
};
