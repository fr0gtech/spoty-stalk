import { prisma } from "database";
import { log } from "./logger";

const logger = log.child({name: 'helpers'})

export const differenceBy = (arr1: any, arr2: any, iteratee: any) => {
  if (typeof iteratee === "string") {
    const prop = iteratee;
    iteratee = (item: any) => item[prop];
  }
  return arr1.filter((c: any) => !arr2.map(iteratee).includes(iteratee(c)));
};
export const scanInfo = async () => {
  logger.info('saving scanInfo')
  await prisma.scan.upsert({
    where: {
      sid: 1
    },
    update: {
      updatedAt: new Date()
    },
    create: {
      sid: 1
    }
  }
  )
}