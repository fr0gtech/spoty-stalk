import axios from "axios";
import { client_id, getSoundCloudClientId } from ".";
import { log } from "../logger";

const logger = log.child({name: 'soundcloudLikes'})
const userId = process.env.SOUNDCLOUD_USER;

export const getLikesTo = async (getTo: any) => {
    logger.info('getLikesTo')
  
    let allLikes: any = [];
    let next:any = "";
    while (next !== null) {
      if (next) {
        let nextUrl = new URL(next)
        nextUrl.searchParams.append('client_id', client_id)
        await axios.get(nextUrl.toString()).then((e: any) => {
          const a = e.data.collection.find((e:any)=> e.track.id === parseInt(getTo.sid))
          if (a){
            allLikes.push(...e.data.collection)
            next = null
          }else{
            allLikes.push(...e.data.collection)
            next = e.data.next_href
          }
        })
      } else if (next === "") {
        await axios.get(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${client_id}`).then((e: any) => {
          const a = e.data.collection.find((e:any)=> e.track.id === parseInt(getTo.sid))
          if (a){
            allLikes.push(...e.data.collection)
            next = null
          }else{
            allLikes.push(...e.data.collection)
            next = e.data.next_href
          }
        })
      }
    }
    const index = allLikes.findIndex((object:any) => object.track.id === parseInt(getTo.sid));
  
    return allLikes.slice(0,index)
  }

export const getLastLike = async () => {
    logger.info('getLastLike')
    return await axios.get(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${client_id}`)
  }
  export const getAllLikes = async () => {
    logger.info('getAllLikes')
  
    let allLikes: any = [];
    let next = "";
    while (next !== null) {
      if (next) {
        let nextUrl = new URL(next)
        nextUrl.searchParams.append('client_id', client_id)
        await axios.get(nextUrl.toString()).then((e: any) => {
          allLikes.push(...e.data.collection)
          next = e.data.next_href
        })
      } else if (next === "") {
        await axios.get(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${client_id}`).then((e: any) => {
          allLikes.push(...e.data.collection)
          next = e.data.next_href
        })
      }
    }
    return allLikes;
  }