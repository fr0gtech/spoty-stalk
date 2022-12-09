import { log } from "../logger";
import { prisma } from "database";
import { Prisma } from "@prisma/client";
import { exit } from "process";

const logger = log.child({name: 'soundcloudSong'})

export const saveSongSC = async (song: any, artist: any) => {
    if (song.track === undefined || song.track.title === undefined) return // if liked thing has no track             
    // logger.debug(`running saveSongSC: ${song.track.title || undefined} - ${artist.name}`)    

    return await prisma.song
      .upsert({
        where: { sid: song.track.id.toString() },
        update: {},
        create: {
          sid: song.track.id.toString(),
          name: song.track.title,
          source: "soundcloud",
          addedAt: song.created_at,
          images: { url: song.track.artwork_url },
          externalUrl: song.track.permalink_url,
          durationMs: song.track.duration,
          artists: {
            connect: {
              name_platform: { name: artist.name, platform: "soundcloud" }
            }
          },
        },
      })
      .then((e) => e)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            logger.error(
              `song ${song.track.title} already exists ${song.track.id}`
            );
          } else {
            logger.error(e);
            exit()
          }
        } else {
          logger.error(e);
          exit()
  
        }
      });
  }