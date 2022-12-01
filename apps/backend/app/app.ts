import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";
import pino from "pino";
import { changedPlaylists, getAllPlaylists, savePlaylist } from "./playlist";
import { getToken } from "./spoty";
import { getSongsFromPlaylist, saveSong } from "./song";
import { saveArtist } from "./artist";
import { scanInfo } from "./helpers";
import cron from 'node-cron'

dotenv.config({ path: "../../.env" });

export const logger = pino();
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

/**
 * @name init
 */
const init = async () => {
  // do not run if we dont have env vars
  if (
    !process.env.SPOTIFY_USER
  ){
    logger.error('process.env.SPOTIFY_USER undefined')
    return;
  }
  // get spoty token
  await getToken();
  // get all playlist on spoty
  const userPlaylists = await getAllPlaylists(process.env.SPOTIFY_USER);
  // compare with playlists we have
  const playlists = await changedPlaylists(userPlaylists);
  // only update changed playlists from above
  const p = playlists.map(async (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    // get songs from playlist
    const songs = await getSongsFromPlaylist(playlist);
    // save playlist
    await savePlaylist(playlist);
    // for each song save it and add artists
      songs.map(async (song: any, i: any) => {
          await saveArtist(song).then(async (artists) => {
            await saveSong(song, artists, playlist);
          });
      })
  });
  scanInfo()
};

cron.schedule('* * * * *', () => {
  init()
});

init()
