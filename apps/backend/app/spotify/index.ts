import { spotifyApi } from "../app";
import { log } from "../logger";
import { saveArtist } from "./artist";
import { changedPlaylists, getAllPlaylists, getSongsFromPlaylistOnDB, savePlaylist } from "./playlist";
import { deleteSong, getSongsDiff, getSongsFromPlaylist, saveSong } from "./song";

/**
 *
 * @returns {token}
 */

 const logger = log.child({ name: "spotify"})

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
export const syncSpotify = async () =>{
  if (!process.env.SPOTIFY_USER) {
    log.error('no spotify user set in env')
    return
  }
  log.info('syncSpotify')
  await getToken();
  const userPlaylists = await getAllPlaylists(process.env.SPOTIFY_USER);
  const playlists = await changedPlaylists(userPlaylists);
  
  // only update changed playlists from above
  playlists.forEach(async (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    const onSpoty = await getSongsFromPlaylist(playlist);
    const onDB = await getSongsFromPlaylistOnDB(playlist)
    const{del, add} = getSongsDiff(onSpoty, onDB)    
    logger.info(`${playlist.name} songs to delete: ${del?.length} songs to add: ${add?.length}`);

    await savePlaylist(playlist)
    add.forEach(async (song: any) => {
        await saveArtist(song).then(async (artists) => {                
          await saveSong(song, artists, playlist);
        });
    })
    del.forEach(async(song:any)=>deleteSong(song))

  });
}