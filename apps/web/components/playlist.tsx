import { Button } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "../pages";
import Top10 from "./top10";
import { useSelector } from "react-redux";
import { selectOpenInApp } from "../redux/settingSlice";
function PlaylistComp(props: any) {
  const openInApp = useSelector(selectOpenInApp);
  const { data: playlists, error: pl_error } = useSWR(
    `/api/playlists`,
    fetcher
  );
  return (
    <Popover2
      popoverClassName="bg-neutral-900 container overflow-scroll"
      content={
        <div className="flex flex-col gap-5 p-5 bg-neutral-900mx-auto !bg-neutral-900">
          <Top10 />
          <div className="flex gap-3 flex-wrap">
            {playlists &&
              playlists.data.map((playlist: any, i: any) => {
                if (playlist.tracks === 0) return;
                return (
                  <Link
                    key={i}
                    href={
                      openInApp
                        ? `spotify:playlist:${playlist.sid}`
                        : playlist.externalUrl
                    }
                  >
                    <Tooltip2
                      minimal
                      content={
                        <div className="text-xs">
                          <div>{playlist.name}</div>
                          <div>{playlist.description}</div>
                          <div>Songs: {playlist.tracks}</div>
                        </div>
                      }
                    >
                      <div className="bg-neutral-800 rounded shadow-md justify-center p-5">
                        <div className="mb-4 truncate max-w-[100px] text-center">
                          {playlist.name}
                        </div>
                        <div className="h-[40px] w-[40px] mx-auto">
                          {playlist.images[0] !== undefined ? (
                            <Image
                              className="rounded-full h-[40px] w-[40px]"
                              width={40}
                              height={40}
                              src={playlist.images[0].url}
                              alt={playlist.name.slice(0, 1)}
                            />
                          ) : (
                            <div className="text-2xl h-[40px] w-[40px] bg-slate-700 rounded-full font-medium text-center leading-[70px]">
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
        </div>
      }
    >
      <Button small className={props.className}>
        Playlists
      </Button>
    </Popover2>
  );
}
export default PlaylistComp;
