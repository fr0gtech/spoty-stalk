import { Prisma } from "@prisma/client";
import { prisma } from "database";
import { exit } from "process";
import { log } from "../logger";
const logger = log.child({ name: "spotifyArtist" });

export const saveArtist = async (song: any) => {
  if (song.track.artists === undefined) {
    return;
  }
  
  return await Promise.all(
    song.track.artists.filter((e:any)=>e).map(async (artist: any) => {
      if (typeof artist.name === "string") {
      return await prisma.artist
        .upsert({
          where: {
            name_platform: { name: artist.name, platform: "spotify" },
          },
          update: {},
          create: {
            sid: artist.id,
            name: artist.name,
            externalUrl: artist.external_urls.spotify,
            platform: "spotify",
          },
        })
        .then((e: any) => e)
        .catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
              // logger.info(
              //   `artist ${artist.name} already exists`
              // );
              if (artist.name) {
                return { name: artist.name, platform: "spotify" };
              } else {
                return;
              }
            } else {
              logger.error(e);
              exit();
            }
          } else {
            logger.error(e);
            exit();
          }
        });
      }
    })
  );
};
