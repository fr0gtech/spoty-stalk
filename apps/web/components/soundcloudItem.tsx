import { Button, Tag } from "@blueprintjs/core";
import { formatDistance, isBefore } from "date-fns";
import Link from "next/link";
import PreviewSC from "./previewSC";
import Soundcloud from "../public/soundcloud.svg"
import NewTag from "./newtag";
import { useDispatch, useSelector } from "react-redux";
import { selectToPlay, setToPlay } from "../redux/settingSlice";
function SoundcloudItem({song,songIndex,pageIndex, lastVisit}:any){
  const dispatch = useDispatch()
  const toPlay = useSelector(selectToPlay)
  const isPlaying = toPlay === songIndex + pageIndex * 50

    return (
        <div
          key={songIndex + pageIndex * 50}
          className="max-w-full duration-200 shadow-md rounded flex flex-col relative grow cursor-pointer"
          onClick={()=>dispatch(setToPlay(songIndex + pageIndex * 50))}

        >
          
          <div className={!isPlaying ? "!z-10 w-full p-2 bg-opacity-90 gap-2 rounded bg-neutral-800" : "!z-10 w-full p-2 bg-opacity-40 gap-2 rounded bg-neutral-800"}>
            <div className="flex gap-2 justify-start items-center">
              {/* <PreviewSC id={song.sid} /> */}
              {/* <Button minimal intent={ isPlaying ? "success" : "none"} icon="play" onClick={()=>dispatch(setToPlay(songIndex + pageIndex * 50))}/> */}
              <h4 title={song.name} className="text-white leading-relaxed mix-blend-difference text-[15px] truncate max-w-[50%] font-semibold">
                {song.name.replace(/\(([^)]+)\)/, "").split('-')[0]}

              </h4>
              <p className="p-0 m-0 leading-relaxed">by</p>
              <div className="flex gap-1 leading-relaxed">
                {song.artists.map((e: any, i: any) => {
                  return (
                      <Tag key={i} className="!bg-neutral-900 !text-neutral-300 text-base"> {e.name}</Tag>
                  );
                })}
              </div>

            </div>
            <div className="flex items-center gap-3 grow text-neutral-300 text-xs text-left">
              {isBefore(
                new Date(lastVisit),
                new Date(song.addedAt)
              ) && <NewTag/>}
              <div className="flex justify-between grow items-center">
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
            className="h-full bg-fill w-full rounded bg-center absolute !z-0 brightness-50"
            style={{
              backgroundImage: `url(${song.images.url || ""})`,
            }} />
          )}
        </div>
      )
}
export default SoundcloudItem