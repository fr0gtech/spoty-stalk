/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let token = req.query.token as any;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization:
        "Basic " +
        new Buffer(
          ((process.env.SPOTIFY_CLIENT_ID as string) +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET) as string
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token,
    }),
  }).then((e) => e.json());

  res.status(200).json({
    accessToken: response.access_token,
    expiresAt: Date.now() / 1000 + response.expires_in,
  });
};
