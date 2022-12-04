import { Tag } from "@blueprintjs/core";
import { formatDistance, isBefore } from "date-fns";
import Link from "next/link";
import PreviewSC from "./previewSC";
import Soundcloud from "../public/soundcloud.svg"
import NewTag from "./newtag";
function SoundcloudItem({song,index, lastVisit}:any){
    return (
        <div
          key={index}
          className="max-w-full duration-200 shadow-md rounded flex flex-col relative grow"
        >
          <div className="!z-10 w-full p-2 bg-opacity-90 items-center gap-2 rounded bg-neutral-800">
            <div className="flex gap-2 justify-start items-center">
              <PreviewSC id={song.sid} />
              <h4 title={song.name} className="text-white leading-relaxed mix-blend-difference text-[15px] truncate max-w-[50%] font-semibold">
                {song.name.replace(/\(([^)]+)\)/, "").split('-')[0]}

              </h4>
              <p className="p-0 m-0 leading-relaxed">by</p>
              <div className="flex gap-1 leading-relaxed">
                {song.artists.map((e: any, i: any) => {
                  return (
                   
                      <Tag
                        className="!bg-neutral-900 !text-neutral-300"
                      >
                        {e.name}

                      </Tag>
                  );
                })}
              </div>

            </div>
            <div className="flex ml-5 items-center gap-3 grow text-neutral-300 text-xs text-left">
              <div>
              {isBefore(
                new Date(lastVisit),
                new Date(song.addedAt)
              ) && <NewTag/>}
              </div>
              <div className="flex justify-between grow">
              {`liked 
              ${formatDistance(
                new Date(song.addedAt),
                new Date(),
                {
                  addSuffix: true,
                }
              )}
               `}                                                                   
              <Link href={song.externalUrl}>
              <Soundcloud height={14} width={14} fill={"#803711"}/>

              </Link>
              </div>
            </div>
          </div>
          {song.images.url && (
            <div
              className="h-[56px] rounded bg-cover bg-center w-full absolute !z-0 brightness-50"
              style={{
                backgroundImage: `url(${song.images.url || ""})`,
              }} />
          )}
        </div>
      )
}
export default SoundcloudItem