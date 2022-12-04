import { Tag } from "@blueprintjs/core";
import useSWR from "swr";
import { fetcher } from "../pages";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectOpenInApp } from "../redux/settingSlice";
import Spotify from '../public/spotify.svg'
import Soundcloud from '../public/soundcloud.svg'
import { Tooltip2 } from "@blueprintjs/popover2";

function Top10(props: any) {
    const openInApp = useSelector(selectOpenInApp)
    const { data: artists, error: pl_error } = useSWR(
        `/api/artists`,
        fetcher
    );
    const createLink = (artist:any)=>{
        if (openInApp && artist.platform === "spotify") return `spotify:artist:${artist.sid}`
        return artist.externalUrl
    }
    return (
        <div className="mx-auto flex gap-5 text-xs items-center h-fit flex-wrap">
            <div className="text-lg">Most added artist: </div>
            {artists && artists.data.map((artist: any, i: any) => {
 
                
                return (

                    <div className="flex gap-1 ">
                        <Link href={createLink(artist)}>
                            <Tooltip2
                            minimal
                            content={<div className="text-xs"><div>{artist.name}</div>songs: {artist._count.songs}</div>
                        }
                            >

                            <Tag className="duration-200">
                                <div className="flex flex-row items-center gap-3">
                                <div>{artist.name} </div>
                                <div>
                                    {artist.platform === "spotify" &&
                                    <Spotify fill={"#1DB954"} height={12} width={12} />
                                    }
                                     {artist.platform === "soundcloud" &&
                                    <Soundcloud fill={"#803711"} height={12} width={12} />
                                    }
                                </div>
                                </div>
                            </Tag>
                            </Tooltip2>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
export default Top10