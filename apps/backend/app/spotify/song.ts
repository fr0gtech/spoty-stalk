import { Prisma } from "@prisma/client";
import { prisma } from "database";
import { exit } from "process";
import { spotifyApi } from "../app";
import { log } from "../logger";
import { tweetSongSpotify } from "../notify";
import { sleep } from "../helpers";

const logger = log.child({ name: "spotifySong" });

export const getSongsFromPlaylist = async (playlist: any) => {
  let data: any = [];
  let total = playlist.tracks.total;
  while (data.length !== total) {
    console.log("gettings songs " + data.length);
    
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

export const saveSong = async (
  song: any,
  artists: any,
  playlist: any,
  fullRun: boolean
) => {
  // leaks and removed or whatever songs can get here with out and id, we do not handle this for now.
  if (!song.track.id) return;
  const ar = artists
    .map((e: any) => {
      if (e) {
        return { name_platform: { name: e.name, platform: "spotify" } };
      } else {
        return undefined;
      }
    })
    .filter(Boolean);

  if (ar.length === 0) {
    logger.error({ song, artists });
    exit();
  }
  if (!fullRun) tweetSongSpotify(song, artists, playlist);
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
        source: "spotify",
        addedAt: song.added_at,
        album: { id: song.track.album.id, name: song.track.album.name },
        images: { ...song.track.album.images },
        externalUrl: song.track.external_urls.spotify,
        previewUrl: song.track.preview_url,
        durationMs: song.track.duration_ms,
        disabled: song.track.available_markets.length === 0,
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
        } else if (e.code === "P2025") {
          logger.error(
            `song ${song.track.name} not added because not able to find artist ${ar}`
          );
          logger.error(e);
          logger.info(ar);
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
export const deleteSong = async (song: any) => {
  await prisma.song.delete({
    where: {
      sid: song.sid,
    },
  });
};
export const getSongsDiff = (onSpoty: any, onDB: any) => {
  const mapsop = onSpoty.map((e: any) => e.track.id);
  const mapsod = onDB?.songs.map((e: any) => e.sid);

  const del =
    mapsod
      ?.filter((x: any) => !mapsop?.includes(x))
      .map((id2find: any) => {
        return onDB?.songs.find((e: any) => {
          return e.sid === id2find;
        });
      }) || [];
  const add =
    mapsop
      ?.filter((x: any) => !mapsod?.includes(x))
      .map((id2find: any) => {
        return onSpoty.find((e: any) => {
          return e.track.id === id2find;
        });
      }) || [];

  return { del, add };
};
