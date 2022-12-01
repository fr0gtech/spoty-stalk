import { Prisma } from "@prisma/client";
import { logger, spotifyApi } from "./app";
import { prisma } from "database";
import { exit } from "process";

export const getSongsFromPlaylist = async (playlist: any) => {
  let data: any = [];
  let total = playlist.tracks.total;
  while (data.length !== total) {
    await spotifyApi
      .getPlaylistTracks(playlist.id, {
        offset: 0 + data.length,
        limit: 10,
        fields: "items",
      })
      .then((e) => {
        data.push(...e.body.items);
      });
  }
  return data;
};

export const saveSong = async (song: any, artists: any, playlist: any) => {
  const ar = artists
    .map((e: any) => {
      if (e) {
        return { name: e.name };
      } else {
        return undefined;
      }
    })
    .filter(Boolean);
  await prisma.song
    .upsert({
      where: { sid: song.track.id },
      update: {
        playlists: {
          connect: [{ sid: playlist.id }],
        },
      },
      create: {
        sid: song.track.id,
        name: song.track.name,
        addedAt: song.added_at,
        images: song.track.album.images,
        externalUrl: song.track.external_urls.spotify,
        previewUrl: song.track.preview_url,
        durationMs: song.track.duration_ms,
        playlists: {
          connect: [{ sid: playlist.id }],
        },
        artists: {
          connect: ar,
        },
      },
    })
    .then((e) => e)
    .catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          logger.error(
            `song ${song.track.name} already exists ${song.track.id}`
          );
        } else {
          logger.error(e);
          logger.info(ar);
          exit();
        }
      } else {
        logger.error(e);
        logger.info(ar);
        exit();
      }
    });
};
