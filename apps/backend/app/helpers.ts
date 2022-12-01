import { prisma } from "database";

export const differenceBy = (arr1: any, arr2: any, iteratee: any) => {
  if (typeof iteratee === "string") {
    const prop = iteratee;
    iteratee = (item: any) => item[prop];
  }
  return arr1.filter((c: any) => !arr2.map(iteratee).includes(iteratee(c)));
};
export const scanInfo =async (playlists:any) => {
  await prisma.scan.create({
    data:{
      updated:{
        connect: playlists.map((e:any)=>{return {sid: e.id}})  
      }
    }
  })
}