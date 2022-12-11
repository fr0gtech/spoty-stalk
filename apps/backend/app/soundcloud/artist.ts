import { log } from "../logger";
import { prisma } from "database";
import { Prisma } from "@prisma/client";

const logger = log.child({ name: "soundcloudArtist" });

export const saveArtistSC = async (song: any) => {
  if (song.track === undefined) return; // if liked thing has no track
  // logger.debug(
  //   `trying to save artist: ${song.track.user.username}`
  // );
  return await prisma.artist
    .upsert({
      where: {
        name_platform: {
          name: song.track.user.username,
          platform: "soundcloud",
        },
      },
      create: {
        sid: song.track.user.id.toString(),
        name: song.track.user.username,
        externalUrl: song.track.user.permalink_url,
        platform: "soundcloud",
      },
      update: {},
    })
    .then((e) => e)
    .catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          // logger.debug(
          //   `artist ${song.track.user.username} already exists`
          // );
          return {
            name: song.track.user.username,
            platform: "soundcloud",
          };
        } else {
          logger.error(e);
          logger.info(song);
        }
      } else {
        logger.error(e);
        logger.info(song);
      }
    });
};
