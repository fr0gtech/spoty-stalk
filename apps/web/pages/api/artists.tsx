/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";
import playlists from "./playlists";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await prisma.artist.findMany({
    orderBy: {
      songs:{
        _count: "desc"
      }
    },

    include: {
      _count: {
        select: { songs: true },
      },
    },
    take: 10
  });

  res.status(200).json({
    data,
  });
};
