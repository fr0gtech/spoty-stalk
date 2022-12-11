import { signIn, useSession } from "next-auth/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SpotifyPlayer from "react-spotify-web-playback";
import {
  selectLoadedSongs,
  selectPlayer,
  selectSpotifySongs,
  selectToPlay,
  setToPlay,
} from "../redux/settingSlice";
import ReactPlayer from "react-player/soundcloud";
import {
  Button,
  ButtonGroup,
  Divider,
  Icon,
  Slider,
  Tag,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { formatDistanceToNow, fromUnixTime, isPast, parseISO } from "date-fns";
import MusicPlayerNeedsLogin from "./musicPlayerNeedsLogin";
import Spotify from "../public/spotify.svg";
import Soundcloud from "../public/soundcloud.svg";
import { setRevalidateHeaders } from "next/dist/server/send-payload";
import toast from "react-simple-toasts";

const emptyTrack = {
  artists: [] as any,
  durationMs: 0,
  id: "",
  image: "",
  name: "",
  uri: "",
};
function MusicPlayer() {
  const dispatch = useDispatch();
  const spref = useRef<any>();
  const scref = useRef<any>();
  const [seek, setSeek] = useState<any>();
  const [seekset, setSeekset] = useState<any>();

  const [duration, setDuration] = useState<any>();

  const [SCseek, setSCseek] = useState<any>();
  const [SCseekset, setSCseekset] = useState<any>();
  const [SCstart, setSCstart] = useState<any>();
  const [SCduration, setSCduration] = useState<any>();
  const [SCready, setSCready] = useState<any>();

  const [SPcallback, setSPcallback] = useState<any>();
  const [SPseek, setSPseek] = useState<any>();
  const [SPduration, setSPduration] = useState<any>();
  const [SPready, setSPready] = useState<any>();
  const [ready, setReady] = useState<any>();

  const [shuffle, setShuffle] = useState<any>();
  const [repeat, setRepeat] = useState<any>();

  // seekerbar
  const [isHolding, setIsHolding] = useState<any>();

  const [player, setPlayer] = useState<any>();
  const [lastToPlay, setLastToPlay] = useState<any>();

  const [playing, setPlaying] = useState(false);
  const [playSetter, setPlaySetter] = useState<any>();
  const [volume, setVolume] = useState(0.1);
  const [lastVolume, setLastVolume] = useState<any>();

  const { data: session, status }: any = useSession();

  const toPlay = useSelector(selectToPlay);
  const loadedSongsMapped = useSelector(selectLoadedSongs);

  // const player = useSelector(selectPlayer)

  // const player = useMemo(()=>{
  //   if (toPlay === null) return
  //   if (loadedSongsMapped && loadedSongsMapped[toPlay] && loadedSongsMapped[toPlay].includes("spotify")){
  //     return 'spotify'
  //   }else{
  //     return 'soundcloud'
  //   }
  // },[toPlay, loadedSongsMapped])

  const seekSPFN = useCallback(
    async (position: any) => {
      await fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
        }
      );
    },
    [session]
  );

  const nextSong = useCallback(() => {
    if (shuffle) {
      dispatch(setToPlay(Math.floor(Math.random() * loadedSongsMapped.length)));
      return;
    }
    if (loadedSongsMapped.length - 1 === toPlay) {
      console.log(
        loadedSongsMapped.length === toPlay,
        loadedSongsMapped.length
      );

      dispatch(setToPlay(0));
      return;
    }
    dispatch(setToPlay(toPlay !== null ? toPlay + 1 : 0));
  }, [dispatch, loadedSongsMapped, shuffle, toPlay]);

  const prevSong = useCallback(() => {
    if (shuffle) {
      dispatch(
        setToPlay(Math.floor(Math.random() * loadedSongsMapped.length - 1))
      );
      return;
    }
    if (toPlay === 0) {
      console.log(loadedSongsMapped.length);
      dispatch(setToPlay(loadedSongsMapped.length - 1));
      return;
    }
    dispatch(setToPlay(toPlay !== null ? toPlay - 1 : 0));
  }, [dispatch, loadedSongsMapped, shuffle, toPlay]);

  // VOLUME
  useEffect(() => {
    if (volume !== undefined && spref.current && player === "spotify")
      spref.current.setVolume(volume);
  }, [volume, spref, player]);

  // sp duration setter
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (spref.current && player === "spotify")
        setSeek(spref.current.state.progressMs / 1000);
      //oh no we need to check here if song over?
      if (
        spref.current &&
        player === "spotify" &&
        duration < spref.current.state.progressMs / 1000
      )
        nextSong();
    }, 100);
    return () => clearTimeout(timeout);
  }, [spref, seek, ready, player, duration, nextSong]);

  // sc seek setter
  useEffect(() => {
    if (scref.current && seekset && player === "soundcloud")
      scref.current.seekTo(seekset, "seconds");
    if (spref.current && seekset && player === "spotify")
      seekSPFN(seekset * 1000);
  }, [seekset, player, scref, spref, session, seekSPFN]);

  // useEffect(()=>{
  //   console.log(SCstart, scref.current && scref.current?.props?.volume);
  //   return ()=>{
  //     setSCstart(false)
  //   }
  // }, [SCstart, scref])
  // // sc duration setter
  // useEffect(() => {
  //   if (scref.current === null || scref.current === undefined) return
  //   const b = setInterval(()=>{
  //     setDuration(scref.current.getDuration())
  //   }, 1000)
  //   return ()=>clearInterval(b)
  // }, [toPlay])

  const setLastSong = useCallback(() => {
    console.log("setLastSong", playSetter);

    if (
      toPlay !== null &&
      loadedSongsMapped !== undefined &&
      loadedSongsMapped[toPlay] !== undefined &&
      playSetter
    ) {
      if (loadedSongsMapped[toPlay][0].includes("soundcloud")) {
        // spref.current.togglePlay()
        // spref.current.updateState({ track: emptyTrack });

        setPlayer("soundcloud");
        setLastToPlay(loadedSongsMapped[toPlay][0]);
      } else {
        spref.current.updateState({ isPlaying: true });
        spref.current.updateState({ needsUpdate: true });
        setLastToPlay([loadedSongsMapped[toPlay]]);
        setPlayer("spotify");
      }
    }

    // onPlay we cache current song
  }, [loadedSongsMapped, playSetter, toPlay]);

  useEffect(() => {
    if (playSetter && ready) {
      // spref.current.togglePlay()
      setLastSong();
      setPlaying(true);
      console.log("trigger setLastSong() from playSetter effect");
    } else if (playSetter) {
      // this helps with ppl clicking too fast after load we need to wait for ready to be set
      toast(`could not play playSetter:${playSetter} ready:${ready}`);
    }
    return () => {
      setPlaySetter(false);
    };
  }, [playSetter, ready, setLastSong]);

  const expiredToken = useMemo(
    () => session && isPast(fromUnixTime(session.expiresAt)),
    [session]
  );
  // if (session){
  //   console.log(session.expiresAt,Date.now(), isPast(fromUnixTime(session.expiresAt)), formatDistanceToNow(session.expiresAt));
  // }

  useEffect(() => {
    if (expiredToken) document.dispatchEvent(new Event("visibilitychange"));
  }, [expiredToken]);

  // const isSpotySong = useMemo(() => (loadedSongsMapped && toPlay !== null) ? loadedSongsMapped[toPlay].includes("spotify") : false, [loadedSongsMapped, toPlay])

  // const lastSong = useMemo(()=> {
  //    if (toPlay === null) return
  //   if (isSpotySong && spotySongs){
  //     return [spotySongs[toPlay]]
  //   }else if (loadedSongsMapped){
  //     return loadedSongsMapped[toPlay][0]
  //   }

  // }, [isSpotySong, loadedSongsMapped, spotySongs, toPlay])

  // useEffect(()=>{
  //   console.log(lastSong);
  //   if (lastSong !== undefined && lastSong !== null){
  //     setLastToPlay(lastSong)
  //   }
  // }, [lastSong])

  useEffect(() => {
    console.log("toPlay");
    if (toPlay !== null) {
      setPlaySetter(true);
    }

    return () => setPlaySetter(false);
  }, [setPlaySetter, toPlay]);

  useEffect(() => {
    console.log("scref spref", SPready);

    if (scref.current && spref.current && SPready) setReady(true);
    // return () => {
    //   setReady(false);
    // };
  }, [SPready]);

  const volumeSlider = useCallback(() => {
    return (
      <div
        onWheel={(e) => {
          const setTo = Math.min(
            Math.max(volume + (e.deltaY / 1000) * -1, 0),
            1
          );
          setVolume(setTo);
        }}
        className="flex gap-4"
        id="scslider"
      >
        <Icon
          onClick={() => {
            if (volume === 0) setVolume(lastVolume || 0.25);
            if (volume > 0) {
              setLastVolume(volume);
              setVolume(0);
            }
          }}
          className="opacity-50"
          icon={
            volume > 0.5
              ? "volume-up"
              : volume === 0
              ? "volume-off"
              : "volume-down"
          }
        />

        <Slider
          className="volumeSlider"
          value={volume}
          onChange={(e: any) => setVolume(e)}
          labelRenderer={false}
          stepSize={0.05}
          min={0}
          max={1}
        />

        <Icon className="opacity-20" icon="fullscreen" />
      </div>
    );
  }, [lastVolume, volume]);

  const renderButtons = useCallback(() => {
    return (
      <div className="flex flex-col justify-center gap-1 grow">
        <div className="mx-auto grow">
          <ButtonGroup className="gap-3 playerbuttons">
            {/* <Button onClick={()=>dispatch(setToPlay(null))} icon="reset" className="!bg-neutral-800">test</Button> */}
            <Button
              minimal
              icon={<Icon icon="random" size={12} />}
              active={shuffle}
              onClick={() => setShuffle(!shuffle)}
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
                playing ? (
                  <Icon color="bg-neutral-900" icon="pause" />
                ) : (
                  <Icon color="bg-neutral-900" icon="play" />
                )
              }
              onClick={() => setPlaying(!playing)}
              className="!bg-neutral-300 !rounded-full duration-100 hover:!scale-105"
            />
            <Button
              minimal
              icon="chevron-right"
              className="!rounded-full hover:!bg-neutral-700 duration-300"
              onClick={() => nextSong()}
            />

            <Button
              minimal
              icon={
                <div>
                  {player === "spotify" ? (
                    <Spotify fill={"#1DB954"} height={15} width={15} />
                  ) : (
                    <Soundcloud fill={"#803711"} height={15} width={15} />
                  )}
                </div>
              }
              className="!rounded-full hover:!bg-neutral-700 duration-300 !p-0 !m-0"
            ></Button>
          </ButtonGroup>
        </div>
        <div>
          <div className="flex items-center gap-4 text-[11px]" id="scslider">
            <span className="whitespace-nowrap">
              {seek ? Math.floor(seek / 60) : 0}:
              {seek
                ? (seek % 60).toFixed(0).padStart(2, "0")
                : (0.0).toFixed(0).padStart(2, "0")}
            </span>
            <Slider
              className="seekSlider"
              onChange={(e) => {
                setSeek(e);
                setIsHolding(true);
              }}
              showTrackFill={true}
              intent="primary"
              onRelease={(e) => {
                setSeekset(e);
                setIsHolding(false);
              }}
              min={0}
              max={duration || 200}
              labelRenderer={false}
              value={seek}
            ></Slider>
            <span className="whitespace-nowrap">
              {duration ? Math.floor(duration / 60) : 0}:
              {duration
                ? (duration % 60).toFixed(0).padStart(2, "0")
                : (0.0).toFixed(0).padStart(2, "0")}
            </span>{" "}
          </div>
        </div>
      </div>
    );
  }, [duration, nextSong, player, playing, prevSong, seek, shuffle]);

  const songRenderer = useCallback(() => {
    if (toPlay === null) {
      return (
        <div className="gap-2 flex flex-col w-[10%] truncate">
          <div>Select Track to play</div>
          <div>
            <Tag className="!bg-neutral-900 !text-neutral-300"> pokeING</Tag>
          </div>
        </div>
      );
    }
    if (player === "spotify" && SPcallback) {
      return (
        <div className="gap-1 flex flex-col w-[10%]">
          <div className="truncate font-bold">
            {SPcallback.track.name || "loading..."}
          </div>
          <div className="flex gap-2 text-xs">
            {SPcallback.track.artists.map((e: any) => e.name).join(", ")}
          </div>
        </div>
      );
    } else if (
      loadedSongsMapped &&
      loadedSongsMapped[toPlay] &&
      Array.isArray(loadedSongsMapped[toPlay][2])
    ) {
      return (
        <div className="gap-2 flex flex-col w-[10%] truncate">
          <div>{loadedSongsMapped[toPlay][1]}</div>
          <div>
            {loadedSongsMapped[toPlay][2].map((e: any, i: any) => {
              if (i < 2)
                return (
                  <Tag key={i} className="!bg-neutral-900 !text-neutral-300">
                    {" "}
                    {e.name}{" "}
                  </Tag>
                );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="gap-2 flex flex-col w-[10%] truncate">
          <div>{"loading..."}</div>
          <div>
            <Tag className="!bg-neutral-900 !text-neutral-300">
              {" "}
              Loading...{" "}
            </Tag>
          </div>
        </div>
      );
    }
  }, [SPcallback, loadedSongsMapped, player, toPlay]);
  if (!session) return <MusicPlayerNeedsLogin />;

  // if (!spotySongs || !loadedSongsMapped || status === "loading" || volume === undefined || volume === null) return <div>Loading</div>
  return (
    <>
      <div className="flex">
        <div className="flex gap-[20%] shadow-xl items-center bg-neutral-800 p-3 rounded w-full justify-between ml-1 mr-1">
          {songRenderer()}
          {renderButtons()}
          {volumeSlider()}
        </div>
      </div>
      <div className="">
        {lastToPlay}- {player}
        <SpotifyPlayer
          initialVolume={volume}
          callback={async (e) => {
            if (e.status === "READY") {
              setSPready(true);
            }
            setDuration(e.track.durationMs / 1000);
            setSPcallback(e);
          }}
          autoPlay={true}
          play={playing && player === "spotify"}
          ref={spref as any}
          syncExternalDevice={true}
          styles={{
            activeColor: "#fff",
            bgColor: "#333",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1cb954",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
          token={session.accessToken}
          uris={lastToPlay}
        />
        {/* 
            REACT PLAYER
            */}
        <ReactPlayer
          onProgress={(e) => {
            if (!isHolding) setSeek(e.playedSeconds);
          }}
          onEnded={() => {
            nextSong();
          }}
          onReady={(e) => {
            setDuration(e.getDuration());
            setSCready(true);
          }}
          onStart={() => {
            setVolume(volume);
            setSCstart(true);
          }}
          ref={scref}
          playing={playing}
          volume={volume || 0.1}
          url={lastToPlay}
        />
      </div>
    </>
  );
}
// check if spoty or soundclouod render player for it

export default MusicPlayer;
