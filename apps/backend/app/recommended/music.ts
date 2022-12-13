import { RecommendedItem } from ".";
import querystring from "node:querystring";
import jsdom from "jsdom";
import { Prisma } from "@prisma/client";
import { prisma } from "database";
import { log } from "../logger";
import { unescapeLeadingUnderscores } from "typescript";
import { exit } from "node:process";

const logger = log.child({ name: "recommendedMusic" });

export const htmlDecode = (input: any) => new jsdom.JSDOM(unescapeHtml(input));
export function unescapeHtml(unsafe: string) {
  return unsafe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
export const findMusicPosts = (e: any) => {
  if (e.media.oembed.provider_url.includes("soundcloud")) {
    const url = htmlDecode(e.media.oembed.html)
      .window.document.querySelector("iframe")
      ?.attributes.getNamedItem("src")?.nodeValue;

    const parsedUrl = querystring.parse(url as string);
    const parsedAPIurl = querystring.parse(
      parsedUrl[Object.keys(parsedUrl)[0]] as string
    );
    if (!e.media.oembed.title.includes("by")) {
      // console.log(e.media.oembed);
    }

    return {
      title: e.media.oembed.title.split("by")[0].trim(),
      sid: e.id,
      externalUrl: querystring.parse(url as string).url?.toString(),
      url: parsedAPIurl.url,
      image: parsedUrl.image,
      description: e.media.oembed.description,
      artist: e.media.oembed.author_name,
      type: e.media.oembed.type,
      source: "soundcloud",
      addedAt: new Date(e.created_utc * 1000),
    } as RecommendedItem;
  }
  if (e.media.oembed.provider_url.includes("spotify")) {
    if (e.media.oembed.description === undefined) return;
    const url = htmlDecode(e.media.oembed.html)
      .window.document.querySelector("iframe")
      ?.attributes.getNamedItem("src")?.nodeValue;

    const parsedUrl = querystring.parse(url as string);
    const parsedAPIurl = parsedUrl[Object.keys(parsedUrl)[0]] as string;

    let artist;
    let type;

    if (new URL(parsedAPIurl).pathname.split("/")[2] === "track") {
      type = "song";
      artist = e.media.oembed.description
        .split("·")[0]
        .split("on Spotify.")[1]
        .trim();
    } else if (new URL(parsedAPIurl).pathname.split("/")[2] === "playlist") {
      type = "playlist";
      artist = e.media.oembed.description.split("·")[0].trim();
      // artist = e.media.oembed.description.split('·').trim()
    } else if (new URL(parsedAPIurl).pathname.split("/")[2] === "album") {
      type = "album";
      artist = unescapeHtml(
        e.media.oembed.description.split("Spotify.")[1].split("·")[0].trim()
      );
    } else if (new URL(parsedAPIurl).pathname.split("/")[2] === "signle") {
      type = "single";
      artist = e.media.oembed.description
        .split("·")[0]
        .split("on Spotify.")[1]
        .trim();
    } else if (new URL(parsedAPIurl).pathname.split("/")[2] === "artist") {
      type = "artist";
      artist = e.media.oembed.description
        .split("·")[0]
        .split("on Spotify.")[0]
        .replace("Listen to", "")
        .trim();
    } else {
      log.error("no match", e.media.oembed.description);
    }

    return {
      title: e.media.oembed.title,
      sid: e.id,
      externalUrl: parsedUrl.url,
      url: parsedAPIurl,
      image: parsedUrl.image,
      description: e.media.oembed.description,
      artist: artist,
      source: "spotify",
      type: type,
      addedAt: new Date(e.created_utc * 1000),
    } as RecommendedItem;
  }
};

export const uploadAll = async (all: RecommendedItem[]) => {
  log.info("uploading all soundcloud or spotify links");
  all.forEach(async (e) => {
    await prisma.recommended
      .createMany({
        data: {
          ...e,
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (err.code === "P2002") {
            logger.error(`alread exist ${e.artist} - ${e.title}`);
          } else {
            logger.error(err);
          }
        }
      });
  });
};
