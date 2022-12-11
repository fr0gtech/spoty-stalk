/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await prisma.scan.findFirst({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    take: 1,
  });

  res.status(200).json({
    data,
  });
};
