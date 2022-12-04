/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cursor = parseInt(req.query.c as any);
  let pageSize = parseInt(req.query.p as any);
    
  if (pageSize > 50 || cursor === undefined || pageSize === undefined) {
    return res.status(404).json({
      error: "error",
    });
  }
  const data = await prisma.recommended.findMany({
    orderBy: [
      {
        addedAt: "desc",
      },
    ],
    skip: cursor > 0 ? cursor * pageSize : 0,
    take: pageSize,
  });

  let nextCursor = data.length !== pageSize ? undefined : cursor + 1;
  let previusCursor = cursor > 0 ? cursor - 1 : 0;

  res.status(200).json({
    data,
    nextCursor,
    previusCursor,
  });
};
