import axios from "axios";
import { log } from "../logger";
import { findMusicPosts, uploadAll } from "./music";


export interface RecommendedItem {
    title: string;
    sid: string;
    externalUrl: string;
    image: string;
    url: string;
    description: string;
    artist: string;
    type: string;
    source: string;
    addedAt: Date;
}

const logger = log.child({ name: 'recommended' })



const getMetaData = async () => {
    return await axios.get(
        `https://api.pushshift.io/reddit/search/submission/?subreddit=${process.env.SUBREDDIT}&metadata=true&size=0`,
        {
            headers: { 'Accept-Encoding': 'text/html; charset=UTF-8' },
        }
    ).then((e) => e.data.metadata)
}

const getAll = async function () {
    logger.info('getting all soundcloud or spotify links')
    const total = (await getMetaData()).total_results

    const pageSize = 250
    let allPosts: RecommendedItem[] = []
    let lastL = pageSize;

    let url = new URL('https://api.pushshift.io/reddit/search/submission/')
    url.searchParams.append("subreddit", process.env.SUBREDDIT as string)
    url.searchParams.append("sort", "desc")
    url.searchParams.append("sort_type", "created_utc")
    url.searchParams.append("size", pageSize.toString())


    while (lastL === pageSize) {
        const post = await axios.get(url.toString(), {
            headers: { 'Accept-Encoding': 'text/html; charset=UTF-8' },
        }).then((e) => e.data.data)
        post.forEach((e: any) => {
            if (e.media && e.media.oembed) {
                const artist = findMusicPosts(e)
                if (artist) allPosts.push(artist)
            }
        }
        )
        // logger.info(`${allPosts.length}/${total} ${url}`)
        url.searchParams.set("before", post[post.length - 1].created_utc)
        lastL = post.length
    }

    return allPosts


}
const getLastDB = async () => {
    return await prisma?.recommended.findFirst({
        orderBy: [
            {
                addedAt: "desc"
            }
        ],
        take: 1
    }).then((e) => e)
}
const getLast = async (lastDB: any) => {
    const pageSize = 250
    let lastL = pageSize;
    let toReturn:any = []
    let url = new URL('https://api.pushshift.io/reddit/search/submission/')
    url.searchParams.append("subreddit", process.env.SUBREDDIT as string)
    url.searchParams.append("sort", "desc")
    url.searchParams.append("sort_type", "created_utc")
    url.searchParams.append("size", pageSize.toString())
    while (lastL === pageSize) {
        const post = await axios.get(
            url.toString(),
            {
                headers: { 'Accept-Encoding': 'text/html; charset=UTF-8' },
            }
        ).then((e) => e.data.data)
        const last = post.some((e: any) => {
            if (e) url.searchParams.set("before", e.created_utc)
            if (e && e.media && e.media.oembed) {
                const rec = findMusicPosts(e)
                if (rec !== undefined && rec.sid === lastDB) return true
                if (rec !== undefined) toReturn.push(rec)
            }

        })
        !last ? lastL = post.length : lastL = 0
    }
    return toReturn
}

export const syncReddit = async () => {
    const lastDB = await getLastDB()
    if (lastDB) {
        // returns array of new post to upload
        const last = await getLast(lastDB.sid)
        if (last.length > 0){
            uploadAll(last)
        }else{
            logger.info('nothing to update')
        }
        
    } else {
        logger.info("getting all posts")
        const all = await getAll()        
        await uploadAll(all.filter(Boolean));
    }

}