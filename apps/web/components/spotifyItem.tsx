import { Tag, Icon } from "@blueprintjs/core";
import { isBefore, formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";
import NewTag from "./newtag";
import Preview from "./preview";
import SoundcloudItem from "./soundcloudItem";
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
function SpotifyItem({song, index, openInApp, topartistsname, lastVisit}:any){
    return (
        <div
          key={index}
          className="max-w-full bg-slate-900 shadow-md rounded h-[56px] flex flex-col relative grow"
        >

          <div className="!z-10 w-full p-2 bg-opacity-90 gap-2 rounded bg-neutral-800">
            <div className="flex gap-2 justify-start">
              <Preview song={song} />
              <h4 title={song.name} className="text-white leading-relaxed mix-blend-difference text-[15px] truncate font-semibold">
                {song.name.replace(/\(([^)]+)\)/, "").split('-')[0]}

              </h4>
              <p className="p-0 m-0 leading-relaxed">by</p>
              <div className="flex gap-1 leading-relaxed">
                {song.artists.map((e: any, i: any) => {
                  if (i > 2) return
                  return (
                    <Link
                      key={i}
                      href={openInApp
                        ? `spotify:artist:${e.sid}`
                        : e.externalUrl}
                    >
                      <Tag
                        className="!bg-neutral-900 !text-neutral-300"
                      >
                        {e.name}

                      </Tag>
                      {topartistsname && topartistsname.indexOf(e.name) !== -1 &&
                        <Tag minimal title={`${e.name} is the #${topartistsname.indexOf(e.name) + 1} most added artist `}>
                          #{topartistsname.indexOf(e.name) + 1}
                          {topartistsname.indexOf(e.name) === 0 && "🔥"}
                        </Tag>

                      }
                    </Link>
                  );
                })}
                 {song.playlists[0].name.includes('Discover Weekly') &&
                 
                   <Tag
                   title="discover weekly song"
                    intent="warning"
                    minimal
                   >
                     <Icon  icon="signal-search" />

                   </Tag>
                 }
              </div>
             
            </div>
            <div className="!z-10 flex items-center gap-1">

              <div className="mix-blend-difference ml-5 gap-3 flex grow text-neutral-300 text-xs text-left">
                <div>
                {isBefore(
                  new Date(lastVisit),
                  new Date(song.addedAt)
                ) && <NewTag/>}
                </div>
                <div>
                {`added 
                ${formatDistance(
                  new Date(song.addedAt),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}
                 to `}
                <Link
                  className="!text-neutral-200"
                  href={openInApp
                    ? `spotify:playlist:${song.playlists[0].sid}`
                    : song.playlists[0].externalUrl}
                >
                  {song.playlists[0].name}
                </Link>
                </div>
              </div>
              <Link
                href={openInApp
                  ? `spotify:track:${song.sid}`
                  : song.externalUrl}
              >
                {openInApp ? (
                  <Spotify
                    fill={"#1DB954"}
                    className={"mix-blend-difference opacity-50"}
                    height={14}
                    width={14} />
                ) : (
                  <Share
                    fill={"#ffffff"}
                    className={"mix-blend-difference opacity-50"}
                    height={14}
                    width={14} />
                )}
              </Link>
            </div>
          </div>
          {song.images[0] && (
            <div
              className="h-[56px] rounded bg-cover bg-center w-full absolute !z-0 brightness-50"
              style={{
                backgroundImage: `url(${song.images[0].url || ""})`,
              }} />
          )}
        </div>
      );

    }                        
export default SpotifyItem