import { Tag } from "@blueprintjs/core";
import useSWR from "swr";
import { fetcher } from "../pages";
import Link from "next/link";
function Top10(props: any) {
    const { data: artists, error: pl_error } = useSWR(
        `/api/artists`,
        fetcher
    );
    return (
        <div className="mx-auto flex gap-5 text-xs items-center overflow-scroll">
            <div>Most added artist: </div>
            {artists && artists.data.map((artist: any, i: any) => {
                return (
                    <div className="flex gap-1 ">
                        <Link href={
                            props.openInApp
                                ? `spotify:artist:${artist.sid}`
                                : artist.externalUrl
                        }>
                            <div className="hover:!opacity-100 duration-200" style={{ opacity: Math.pow(i, -1)}}>
                                <Tag minimal >{artist.name} </Tag>
                                <Tag minimal >{artist._count.songs}</Tag>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
export default Top10