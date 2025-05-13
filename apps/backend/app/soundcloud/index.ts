/**
 * THIS IS REALLY BAD
 *
 */

import axios from "axios";
import puppeteer from "puppeteer";
import { prisma } from "database";
import { exit } from "process";
import { log } from "../logger";
import { getAllLikes, getLastLike, getLikesTo } from "./likes";
import { saveArtistSC } from "./artist";
import { saveSongSC } from "./song";

const logger = log.child({ name: "soundcloud" });

if (
  process.env.SOUNDCLOUD_USER === null ||
  process.env.SOUNDCLOUD_USER === undefined
)
  exit();
const userId = process.env.SOUNDCLOUD_USER;
export let client_id: any;

/**
 * this is all kind of fucked and may break idk need to test
 * @returns client_id
 */
export const getSoundCloudClientId = async () => {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: '/usr/bin/chromium-browser'
  });
  const page = await browser.newPage();
  await page.goto("https://soundcloud.com/discover"); // idk if this is needed at all
  // await page.waitForSelector(".soundTitle__titleContainer"); //wait for this not sure if needed
  await page.setRequestInterception(true);
  const result = await new Promise((resolve) =>
    page.on("request", (request: any) => {
      if (new URL(request.url()).searchParams.get("client_id") !== null) {
        resolve(new URL(request.url()).searchParams.get("client_id"));
        browser.close();
      }
    })
  );
  logger.info(`got sc client_id ${result}`);
  client_id = result;
  return result as string;
};

export const getUserInfo = async () => {
  logger.info("getUserInfo");
  return await axios.get(
    `https://api-v2.soundcloud.com/users/${userId}?client_id=${client_id}`
  );
};

export const syncSoundCloud = async () => {
  await getSoundCloudClientId();
  logger.info("saveLikes");
  //check last like we saved and save al in between
  // check prisma for last liked song
  const llSC = await (await getLastLike()).data.collection[0];
  const llDB = await prisma?.song.findFirst({
    orderBy: [
      {
        addedAt: "desc",
      },
    ],
    where: {
      source: "soundcloud",
    },
    select: {
      sid: true,
      name: true,
    },
  });
  if (llSC.track.id.toString() === llDB?.sid.toString()) {
    logger.info("saveLikes done because llSC === llDB");
    return;
  }
  if (llDB === null) {
    logger.info("saveLikes no last like need to load all");
    const allLikes = await getAllLikes();
    allLikes.forEach(async (song: any) => {
      const artist = await saveArtistSC(song);
      await saveSongSC(song, artist, true);
    });
  } else {
    logger.info("saveLikes got last like getting all before");

    // we need to get new likes till we find oldest we have
    // lldb
    const newLikes = await getLikesTo(llDB);
    newLikes.forEach(async (song: any) => {
      const artist = await saveArtistSC(song);
      const savedsong = await saveSongSC(song, artist, false);
    });
  }
};
