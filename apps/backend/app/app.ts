import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";
import { log } from "./logger";
import { syncSoundCloud } from "./soundcloud";
import { scanInfo } from "./helpers";
import { syncSpotify } from "./spotify";
import { syncReddit } from "./recommended";
import cron from "node-cron";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const logger = log.child({ name: "app" });
const run = async () => {
  if (!process.env.SPOTIFY_USER) {
    logger.error("process.env.SPOTIFY_USER undefined");
    return;
  }
  syncSpotify();
  syncSoundCloud();
  // syncReddit();
  scanInfo();
};

run();

cron.schedule("* * * * *", () => {
  run();
});
