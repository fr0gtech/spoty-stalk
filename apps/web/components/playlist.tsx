import { Button } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "../pages";
function PlaylistComp(props:any){
    const { data: playlists, error: pl_error } = useSWR(
        `/api/playlists`,
        fetcher
      );
return (
<Popover2
    popoverClassName="bg-neutral-900 container overflow-scroll cursor-pointer"
    content={
      <div className="flex gap-3 p-5 bg-neutral-900 ">
        {playlists &&
          playlists.data.map((playlist: any) => {
            if (playlist.tracks === 0) return
            return (
              <Link
                href={
                  props.openInApp
                    ? `spotify:playlist:${playlist.sid}`
                    : playlist.externalUrl
                }
              >
                <Tooltip2 content={
                <div><div>{playlist.description}</div><div>Songs: {playlist.tracks}</div></div>
                }>
                <div className="bg-neutral-800 rounded shadow-md justify-center p-5">
                  <div className="mb-4 truncate max-w-[100px] text-center">
                    {playlist.name}
                  </div>
                  <div className="h-[75px] w-[75px] mx-auto">
                    {playlist.images[0] !== undefined ? (
                      <Image
                        className="rounded-full h-[75px] w-[75px]"
                        width={75}
                        height={75}
                        src={playlist.images[0].url}
                        alt={playlist.name.slice(0, 1)}
                      />
                    ) : (
                      <div className="text-2xl h-[75px] w-[75px] bg-slate-700 rounded-full font-medium text-center leading-[70px]">
                        {playlist.name.slice(0, 1)}
                      </div>
                    )}
                    
                  </div>
                </div>
                  
                </Tooltip2>

              </Link>
            );
          })}
      </div>
    }
  >
    <Button className={props.className} minimal>Playlists</Button>
  </Popover2>)
}
export default PlaylistComp