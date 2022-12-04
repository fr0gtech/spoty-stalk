import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";
import { log } from "./logger";
import { syncSoundCloud } from "./soundcloud";
import { scanInfo } from "./helpers";
import { syncSpotify } from "./spotify";
import { syncReddit } from "./recommended";

dotenv.config({ path: "../../.env" });


export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const logger = log.child({name: 'app'})
const run = async () => {
  if (
    !process.env.SPOTIFY_USER
  ){
    logger.error('process.env.SPOTIFY_USER undefined')
    return;
  }
  syncSpotify()
  syncSoundCloud()
  syncReddit()
  scanInfo()

};

run()


// cron.schedule('* * * * *', () => {
//   run()
// });




