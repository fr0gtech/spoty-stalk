import { Button, ButtonGroup, Icon, Slider } from "@blueprintjs/core";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDurationMS,
  selectLoadedSongs,
  selectPlay,
  selectProgressMS,
  selectShuffle,
  selectSongInfo,
  selectSongToPlay,
  selectType,
  setIsSeeking,
  setPlay,
  setPlaySetter,
  setProgressMS,
  setSeekTo,
  setShuffle,
  setSongToPlay,
} from "../../redux/playerSlice";
import Spotify from "../../public/spotify.svg";
import Soundcloud from "../../public/soundcloud.svg";
import { useCallback } from "react";
import { useMusicControls } from "./functions";

function Buttons(props: any) {
  const dispatch = useDispatch();
  const shuffle = useSelector(selectShuffle);
  const play = useSelector(selectPlay);
  const songDetails = useSelector(selectSongInfo);
  const playerType = useSelector(selectType);
  const durationMs = useSelector(selectDurationMS);
  const progressMS = useSelector(selectProgressMS);
  const loadedSongsMapped = useSelector(selectLoadedSongs);
  const songToPlay = useSelector(selectSongToPlay);
  const { nextSong, prevSong } = useMusicControls();


  if (!loadedSongsMapped) return <div>loading</div>;
  return (
    <div className="flex flex-col justify-center gap-1 grow">
      <div className="mx-auto grow">
        <ButtonGroup className="gap-3 playerbuttons">
          {/* <Button onClick={()=>dispatch(setToPlay(null))} icon="reset" className="!bg-neutral-800">test</Button> */}
          <Button
            minimal
            icon={<Icon icon="random" size={12} />}
            active={shuffle}
            onClick={() => dispatch(setShuffle(!shuffle))}
            className=" !rounded-full hover:!bg-neutral-700 duration-300"
          />
          <Button
            minimal
            icon="chevron-left"
            onClick={() => prevSong()}
            className="!rounded-full hover:!bg-neutral-700 duration-300"
          />
          <Button
            minimal
            icon={
              play ? (
                <Icon color="bg-neutral-900" icon="pause" />
              ) : (
                <Icon color="bg-neutral-900" icon="play" />
              )
            }
            onClick={() => {
              dispatch(setPlay(!play));
            }}
            className="!bg-neutral-300 !rounded-full duration-100 hover:!scale-105"
          />
          <Button
            minimal
            icon="chevron-right"
            className="!rounded-full hover:!bg-neutral-700 duration-300"
            onClick={() => nextSong()}
          />
          <div className="flex items-center">
            <Link
              href={
                songDetails && songDetails.song && songDetails.song.uri
                  ? songDetails.song.uri
                  : ""
              }
              className="!no-underline !text-neutral-200 hover:!underline"
            >
              <div>
                {playerType === "spotify" && (
                  <Spotify fill={"#ffffff"} height={22} width={22} />
                )}
                {playerType === "soundcloud" && (
                  <Soundcloud fill={"#ffffff"} height={22} width={22} />
                )}
              </div>
            </Link>
          </div>
        </ButtonGroup>
      </div>
      <div>
        <div className="flex items-center gap-4 text-[11px]" id="scslider">
          <span className="whitespace-nowrap">
            {progressMS ? Math.floor(progressMS / 1000 / 60) : 0}:
            {progressMS
              ? ((progressMS / 1000) % 60).toFixed(0).padStart(2, "0")
              : (0.0).toFixed(0).padStart(2, "0")}
          </span>
          <Slider
            className="seekSlider"
            onChange={(e) => {
              dispatch(setProgressMS(e));
              dispatch(setIsSeeking(true));
            }}
            showTrackFill={true}
            intent="primary"
            onRelease={(e) => {
              dispatch(setSeekTo(e));
              dispatch(setIsSeeking(false));
            }}
            min={0}
            max={durationMs || 200}
            labelRenderer={false}
            value={progressMS}
          ></Slider>
          <span className="whitespace-nowrap">
            {durationMs ? Math.floor(durationMs / 1000 / 60) : 0}:
            {durationMs
              ? ((durationMs / 1000) % 60).toFixed(0).padStart(2, "0")
              : (0.0).toFixed(0).padStart(2, "0")}
          </span>{" "}
        </div>
      </div>
    </div>
  );
}

export default Buttons;
