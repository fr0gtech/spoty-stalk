import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotifyPlayer from "react-spotify-web-playback";
import {
  selectLoadedSongs,
  selectPlayerReady,
  selectSongDetails,
  selectToPlay,
  setPlayerReady,
  setSongDetails,
  setSongPlaying,
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
import { fromUnixTime, isPast } from "date-fns";
import MusicPlayerNeedsLogin from "./musicPlayerNeedsLogin";
import Spotify from "../public/spotify.svg";
import Soundcloud from "../public/soundcloud.svg";
import toast from "react-simple-toasts";
import Image from "next/image";
import { shimmer, toBase64 } from "../pages";
import Link from "next/link";
import { Toast } from "./toaster";
import useStorage from "../hooks/useSessionStorage";
import { useRouter } from "next/router";
import MusicPlayerCantPlayHere from "./musicPlayCantPlayHere";
import { getToken } from "next-auth/jwt";

function MusicPlayer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getItem, setItem } = useStorage();
  const { data: session, status }: any = useSession();
  const toPlay = useSelector(selectToPlay);
  const loadedSongsMapped = useSelector(selectLoadedSongs);
  const spref = useRef<any>(); // html ref spotify
  const scref = useRef<any>(); // html ref soundcloud
  const [SPcallback, setSPcallback] = useState<any>(); // spotify callback TODO: dont need it can get state from spref?
  const [SPready, setSPready] = useState<any>(); // spotify ready state
  // PLAYER
  // const [ready, setReady] = useState<any>(); // if we are ready to play
  const ready = useSelector(selectPlayerReady);
  const [player, setPlayer] = useState<any>(); // type if spoty or sc
  // TIMELINE / SEEK
  const [seek, setSeek] = useState<any>(); // where we are in a song
  const [duration, setDuration] = useState<any>(); // full song duration
  const [seekset, setSeekset] = useState<any>(); // a state to change seek position
  const [isHolding, setIsHolding] = useState<any>(); // if user is holding the seeker so we can stop setting it then
  // PLAYING / PAUSE
  const [playing, setPlaying] = useState(false); // play pause
  const [playSetter, setPlaySetter] = useState<any>(); // play setter if user presses play we set it here this sets playing
  const [SPplaying, setSPplaying] = useState<any>();
  // VOLUME
  const [volume, setVolume] = useState<any>(0);
  const [lastVolume, setLastVolume] = useState<any>();
  // SHUFFLE TODO: add history
  const [shuffle, setShuffle] = useState<any>();
  // SONG TO PLAY
  const [songToPlay, setSongToPlay] = useState<any>();

  // SONG INFO
  const songDetails = useSelector(selectSongDetails);

  const [accessToken, setAccessToken] = useState<any>();
  const [tokenExpires, setTokenExpires] = useState<any>();

  useEffect(() => {
    const oldV = getItem("volume");
    if (oldV) {
      console.log("setting nold", volume);

      setVolume(parseFloat(oldV));
    }
    // if (spref.current){
    //   console.log(spref.current);

    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (spref.current) {
      // console.log(spref.current);
    }
  }, [spref]);

  const getTokenAndSet = useCallback(async () => {
    await fetch("/api/refreshtoken?token=" + session.refreshToken).then(
      async (e) => {
        const body = await e.json();
        setAccessToken(body.accessToken);
        setTokenExpires(body.expiresAt);
      }
    );
  }, [session]);

  // this is pretty bad fix for now
  useEffect(() => {
    if (session) {
      setAccessToken(session.access_token);
      setTokenExpires(session.expiresAt);
      if (isPast(new Date(tokenExpires * 1000))) {
        // get new token
        getTokenAndSet();
        // signIn()
      }
    }
  }, [getTokenAndSet, session, tokenExpires]);

  useEffect(() => {
    if (volume) setItem("volume", volume.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

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
      dispatch(
        setToPlay(
          loadedSongsMapped[
            Math.floor(Math.random() * loadedSongsMapped.length)
          ]
        )
      );
      return;
    }
    if (loadedSongsMapped.length - 1 === toPlay) {
      dispatch(setToPlay(0));
      return;
    }
    // so we need to get next song url
    const next = loadedSongsMapped[loadedSongsMapped.indexOf(toPlay) + 1];
    if (next) {
      dispatch(setToPlay(next));
    } else {
      dispatch(setToPlay(loadedSongsMapped[0]));
    }
    setSeek(0);
    // dispatch(setToPlay(toPlay !== null ? toPlay + 1 : 0));
  }, [dispatch, loadedSongsMapped, shuffle, toPlay]);

  const prevSong = useCallback(() => {
    // TODO: save history of shuffle so you can go back
    if (shuffle) {
      dispatch(
        setToPlay(
          loadedSongsMapped[
            Math.floor(Math.random() * loadedSongsMapped.length)
          ]
        )
      );
      return;
    }

    const prev = loadedSongsMapped[loadedSongsMapped.indexOf(toPlay) - 1];
    console.log(prev);
    if (prev) {
      dispatch(setToPlay(prev));
    } else {
      dispatch(setToPlay(loadedSongsMapped[loadedSongsMapped.length - 1]));
    }
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
      // if (
      //   spref.current &&
      //   player === "spotify" &&
      //   duration <= spref.current.state.progressMs / 1000
      // ){
      //   nextSong();
      // }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [spref, seek, player, nextSong, duration]);

  // sc seek setter
  useEffect(() => {
    if (scref.current && seekset && player === "soundcloud")
      scref.current.seekTo(seekset, "seconds");
    if (spref.current && seekset && player === "spotify")
      seekSPFN((seekset * 1000).toFixed(0));
  }, [seekset, player, scref, spref, session, seekSPFN]);

  const setLastSong = useCallback(() => {
    if (
      toPlay !== null &&
      loadedSongsMapped !== undefined &&
      playSetter &&
      spref.current !== undefined
    ) {
      if (toPlay.includes("soundcloud")) {
        setPlayer("soundcloud");
        setSongToPlay(toPlay);
        dispatch(setSongPlaying(toPlay));
      } else {
        spref.current.updateState({ isPlaying: true });
        spref.current.updateState({ needsUpdate: true });
        setPlayer("spotify");
        setSongToPlay([`spotify:track:${toPlay}`]);
        dispatch(setSongPlaying(toPlay));
      }
    }
    // onPlay we cache current song
  }, [dispatch, loadedSongsMapped, playSetter, toPlay]);

  useEffect(() => {
    if (playSetter && ready) {
      setSeek(0);
      setLastSong();
      setPlaying(true);
    } else if (playSetter) {
      // this helps with ppl clicking too fast after load we need to wait for ready to be set
      toast(`could not play playSetter:${playSetter} ready:${ready}`);
    }
    return () => {
      setPlaySetter(false);
    };
  }, [playSetter, ready, setLastSong]);

  useEffect(() => {
    if (toPlay !== null) setPlaySetter(true);
    return () => setPlaySetter(false);
  }, [setPlaySetter, toPlay]);

  useEffect(() => {
    if (scref.current && spref.current && SPready) {
      dispatch(setPlayerReady(true));
    }
  }, [SPready, dispatch]);

  const getSCDetails = useCallback(async () => {
    console.log("getSCdetails");

    const player = scref.current.getInternalPlayer();
    player.getCurrentSound(function (sound: any) {
      if (!sound) return;
      dispatch(
        setSongDetails({
          song: {
            title: sound.title,
            image: sound.artwork_url || "",
            uri: sound.permalink_url,
          },
          artists: [
            { name: sound.user.username, url: sound.user.permalink_url },
          ],
        })
      );
    });
  }, [dispatch]);

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
              onClick={() => {
                toPlay !== null
                  ? setPlaying(!playing)
                  : Toast?.show({ message: "select a song to play" });
              }}
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
                <Link
                  href={
                    songDetails && songDetails.song && songDetails.song.uri
                      ? songDetails.song.uri
                      : ""
                  }
                  className="!no-underline !text-neutral-200 hover:!underline"
                >
                  <div>
                    {player === "spotify" ? (
                      <Spotify fill={"#1DB954"} height={15} width={15} />
                    ) : (
                      <Soundcloud fill={"#803711"} height={15} width={15} />
                    )}
                  </div>
                </Link>
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
  }, [
    duration,
    nextSong,
    player,
    playing,
    prevSong,
    seek,
    shuffle,
    songDetails,
    toPlay,
  ]);

  if (!session) return <MusicPlayerNeedsLogin />;
  if (router.pathname !== "/") return <MusicPlayerCantPlayHere />;
  return (
    <>
      <div className="flex">
        <div className="flex gap-[20%] shadow-xl items-center bg-neutral-800 p-2 rounded w-full justify-between ml-[2px] mr-[2px]">
          {/* <div>{JSON.stringify(songDetails)}</div> */}
          {songDetails && songDetails.song ? (
            <div className="flex gap-2 w-[10%]">
              {songDetails.song.image === "" ? (
                <Image
                  src="/frog.png"
                  className="rounded bg-neutral-900 h-[50px] w-[50px] shadow-md shadow-neutral-900/100"
                  alt="tets"
                  height={50}
                  width={50}
                />
              ) : (
                <Image
                  className="rounded bg-neutral-900 h-[50px] w-[50px] shadow-md shadow-neutral-900/100"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(50, 50)
                  )}`}
                  src={songDetails && songDetails.song.image}
                  height={50}
                  width={50}
                  alt={songDetails.song.title}
                />
              )}

              {/* {songDetails.song.image} */}
              <div className="justify-center flex flex-col">
                <Link
                  href={
                    songDetails && songDetails.song.uri
                      ? songDetails.song.uri
                      : ""
                  }
                  className="!no-underline !text-neutral-200 hover:!underline"
                >
                  <div className="truncate font-bold">
                    {songDetails.song.title}
                  </div>
                </Link>
                <div className="flex gap-1 text-xs">
                  {songDetails.artists.map((e: any) => {
                    return (
                      <Link
                        href={e.url || e.external_urls.spotify}
                        className="!no-underline !text-neutral-400 hover:!underline"
                      >
                        <div className="truncate">{e.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="gap-2 flex flex-col w-[10%]">
              <div></div>
              <div></div>
            </div>
          )}
          {renderButtons()}
          {volumeSlider()}
        </div>
      </div>
      <div className="opacity-0 !-z-10 absolute bottom-0 left-0">
        <SpotifyPlayer
          initialVolume={volume}
          callback={async (e) => {
            // we need a isPlaying state to check for nextsong
            if (e.isActive && e.isPlaying) {
              setSPplaying(true);
            }
            if (e.isActive && !e.isPlaying) {
              setSPplaying(false);
            }
            if (e.isPlaying) {
              dispatch(
                setSongDetails({
                  song: {
                    title: e.track.name,
                    image: e.track.image,
                    uri: e.track.uri,
                  },
                  artists: e.track.artists,
                })
              );
            }
            // check when playing when not only do next song check then this is fucked!
            if (
              e.status === "READY" &&
              e.isActive &&
              !e.isPlaying &&
              seek !== 0 &&
              SPplaying
            ) {
              // IS REALLY DONE?????
              nextSong();
            }
            if (e.status === "READY") setSPready(true);
            setDuration(e.track.durationMs / 1000);
            setSPcallback(e);
          }}
          autoPlay={true}
          play={playing && player === "spotify"}
          ref={spref as any}
          syncExternalDevice={true}
          token={session.accessToken}
          uris={songToPlay}
        />
        <ReactPlayer
          muted={volume === 0}
          onProgress={(e) => !isHolding && setSeek(e.playedSeconds)}
          onEnded={() => nextSong()}
          onReady={(e) => {
            setDuration(e.getDuration());
            getSCDetails();
          }}
          onStart={() => {
            setVolume(volume);
          }}
          ref={scref}
          playing={playing}
          volume={volume || 0.1}
          url={songToPlay}
        />
      </div>
    </>
  );
}
// check if spoty or soundclouod render player for it

export default MusicPlayer;
