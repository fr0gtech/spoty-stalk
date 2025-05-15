import { spotifyApi } from "../app";
import { sleep } from "../helpers";
import { log } from "../logger";
import { saveArtist } from "./artist";
import {
  changedPlaylists,
  getAllPlaylists,
  getSongsFromPlaylistOnDB,
  savePlaylist,
} from "./playlist";
import {
  deleteSong,
  getSongsDiff,
  getSongsFromPlaylist,
  saveSong,
} from "./song";

/**
 *
 * @returns {token}
 */

const logger = log.child({ name: "spotify" });
let fullRun: boolean;
export const getToken = async () => {
  logger.info("getToken - Trying to get access token");
  try {
    spotifyApi.setAccessToken(
      (await spotifyApi.clientCredentialsGrant()).body.access_token
    );
  } catch (e) {
    throw console.error("no token", e);
  }
};
export const syncSpotify = async () => {
  if (!process.env.SPOTIFY_USER) {
    log.error("no spotify user set in env");
    return;
  }
  log.info("syncSpotify");
  await getToken();
  const userPlaylists = await getAllPlaylists(process.env.SPOTIFY_USER);
  const playlists = await changedPlaylists(userPlaylists);

  // only update changed playlists from above
  for(const e in playlists){
    console.log("saving playlist " + playlists[e].name);
    
    const onSpoty = await getSongsFromPlaylist(playlists[e]);
    const onDB = await getSongsFromPlaylistOnDB(playlists[e]);
    logger.info(
      `${onSpoty.length} songs to onspoty: ${onDB?.songs.length} songs on db`
    );
    
    if (!onDB) fullRun = true;
    const { del, add } = getSongsDiff(onSpoty, onDB?.songs ? onDB : []);
    
    logger.info(
      `${playlists[e].name} songs to delete: ${del?.length} songs to add: ${add?.length}`
    );

    await savePlaylist(playlists[e]);
    add.forEach(async (song: any) => {
      await saveArtist(song).then(async (artists) => {
        console.log("saving song " + song + " _ " + artists);
        
        await saveSong(song, artists, playlists[e], fullRun);
      });
    });
    del.forEach(async (song: any) => deleteSong(song));
  }

};
