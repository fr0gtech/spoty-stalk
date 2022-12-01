import { Prisma } from "@prisma/client";
import { prisma } from "database";
import { logger } from "./app";

export const saveArtist = async (song: any) => {
  return await Promise.all(
    song.track.artists.map(async (artist: any) => {
      const found = await prisma.artist
        .findFirst({
          where: {
            name: artist.name,
          },
        })
        .then((e) => e);        
      if (found !== null) {
        return found;
      } else {
        return await prisma.artist
          .create({
            data: {
              sid: artist.id,
              name: artist.name,
              externalUrl: artist.external_urls.spotify,
            },
          })
          .then((e) => e)
          .catch((e) => {
            console.log(e);

            return "notfound";
          });
      }
      // return await prisma.artist
      //   .upsert({
      //     where: { name: artist.name},
      //     update: {},
      //     create: {
      //       sid: artist.id,
      //       name: artist.name,
      //       externalUrl: artist.external_urls.spotify,
      //     },
      //   })
      //   .then((e: any) => e)
      //   .catch((e: Prisma.PrismaClientKnownRequestError) => {
      //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
      //       if (e.code === "P2002") {
      //         logger.info(`artist ${artist.name} already exists`);
      //         return e

      //       } else {
      //         logger.error(e);
      //         return e
      //       }
      //     }else{
      //       logger.error(e);
      //       return e
      //     }
      //   });
    })
  );
};
