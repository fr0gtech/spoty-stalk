/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cursor = parseInt(req.query.c as any);
  let pageSize = parseInt(req.query.p as any);
  let spotify = JSON.parse(req.query.sp as any);
  let soundcloud = JSON.parse(req.query.sc as any);

  if (pageSize > 100 || cursor === undefined || pageSize === undefined) {
    return res.status(404).json({
      error: "error",
    });
  }
  const data = await prisma.song.findMany({
    orderBy: [
      {
        addedAt: "desc",
      },
      {
        name: "desc",
      },
    ],
    where: {
      OR: [
        {
          source: spotify ? "spotify" : "",
        },
        {
          source: soundcloud ? "soundcloud" : "",
        },
      ],
    },
    select: {
      sid: true,
      images: true,
      durationMs: true,
      previewUrl: true,
      externalUrl: true,
      name: true,
      source: true,
      addedAt: true,
      album: true,
      artists: true,
      playlists: {
        select: {
          sid: true,
          externalUrl: true,
          name: true,
        },
      },
    },
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
