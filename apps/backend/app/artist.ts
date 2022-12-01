import { Prisma } from "@prisma/client";
import { prisma } from "database";
import { exit } from "process";
import { logger } from "./app";

export const saveArtist = async (song: any) => {
  return await Promise.all(
    song.track.artists.map(async (artist: any) => {
      
      // const found = await prisma.artist
      //   .findFirst({
      //     where: {
      //       name: artist.name,
      //     },
      //   })
      //   .then((e) => e)
      // if (found !== null) {
      //   console.log('found', artist.name);
      //   return found;
      // } else {
      //   console.log('need to create', artist.name);

      //   return await prisma.artist
      //     .create({
      //       data: {
      //         sid: artist.id,
      //         name: artist.name,
      //         externalUrl: artist.external_urls.spotify,
      //       },
      //     })
      //     .then((e) => e)
      //     .catch((e) => {
      //       if (e instanceof Prisma.PrismaClientKnownRequestError) {
      //         // The .code property can be accessed in a type-safe manner
      //         if (e.code === "P2002") {
      //           logger.error(
      //             `artist ${artist.name} already exists`
      //           );
      //           exit()
      //         } else {
      //           logger.error(e);
      //           logger.error(artist)
      //           exit();
      //         }
      //     }
      //     exit();

      //   });
      // }

      return await prisma.artist
        .upsert({
          where: { name: artist.name},
          update: {},
          create: {
            sid: artist.id,
            name: artist.name,
            externalUrl: artist.external_urls.spotify,
          },
        })
        .then((e: any) => e).catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
              logger.info(
                `artist ${artist.name} already exists`
              );
            } else {
              logger.error(e);
              exit();
            }
          } else {
            logger.error(e);
            exit();
          }
        });
      })
  );
};
