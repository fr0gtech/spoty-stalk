import { spotifyApi } from "../app";
import { differenceBy, sleep } from "../helpers";
import { prisma } from "database";
import { log } from "../logger";

const logger = log.child({ name: "spotifyPlaylist" });

export const changedPlaylists = async (playlists: any) => {
  const weHave = await prisma.playlist.findMany({
    select: {
      sid: true,
      name: true,
      lastSnapShotId: true,
    },
  });
  const userHas = playlists.data.map((playlist: any) => {
    return {
      sid: playlist.id,
      name: playlist.name,
      lastSnapShotId: playlist.snapshot_id,
    };
  });
  const diffed = differenceBy(userHas, weHave, "lastSnapShotId");
  const changed = diffed.map((diffed: any) =>
    playlists.data.find((e: any) => {
      if (e.id === diffed.sid) return e;
    })
  );
  logger.info(
    `changedPlaylists - Returning ${changed.length} playlists that have changed`
  );
  return changed;
};

/**
 * @name getAllPlaylists
 * gets all playlists of a user does the pagination until there is no more data to get and returns that with a total
 * @param userId
 * @param offset
 * @param limit
 * @returns { data, total}
 */
export const getAllPlaylists = async (userId: string) => {
  let data: SpotifyApi.PlaylistObjectSimplified[] = [];
  let last: any = [];
  while (last.next !== null) {
    if (last.next && last.next.length !== 0) {
      const of: string = new URL(last.next).searchParams.get("offset") || "0";
      const li: string = new URL(last.next).searchParams.get("limit") || "0";
      await spotifyApi
        .getUserPlaylists(userId, { offset: parseInt(of), limit: parseInt(li) })
        .then((d) => {
          last = d.body;
          data.push(...d.body.items);
        });
    } else {
      await spotifyApi.getUserPlaylists(userId, { limit: 10 }).then((d) => {
        last = d.body;
        data.push(...d.body.items);
      });
    }
    await sleep(5000)
  }
  logger.info(`getAllPlaylists - Got ${data.length}/${last.total} playlists`);

  return { data: data, total: last.total };
};

export const savePlaylist = async (playlist: any) => {
  logger.info(`saving playlist ${playlist.name}`);
  console.log(playlist);
  console.log(playlist.id);
  
  
  // maybe check snapshot id here to check if we need to do anything for this playlist
  return await prisma.playlist
    .upsert({
      where: { sid: playlist.id },
      create: {
        sid: playlist.id,
        name: playlist.name,
        description: playlist.description,
        externalUrl: playlist.external_urls.spotify,
        images: playlist.images ? playlist.images : "",
        lastSnapShotId: playlist.snapshot_id,
        tracks: playlist.tracks.total,
      },
      update: { lastSnapShotId: playlist.snapshot_id },
    })
    .then((e) => e);

  // snapshot_id is very helpful and should only change on change?
  // we check when we last did scan and filter out what we need to add
};
export const getSongsFromPlaylistOnDB = async (playlist: any) => {
  return await prisma.playlist.findFirst({
    where: {
      sid: playlist.id,
    },
    select: {
      songs: true,
    },
  });
};
