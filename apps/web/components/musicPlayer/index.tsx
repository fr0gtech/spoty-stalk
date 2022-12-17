import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SoundCloudPlayerComp from "./soundcloud";
import SpotifyPlayer from "./spotify";
import Image from "next/image";
import { shimmer, toBase64 } from "../../pages";
import { isPast } from "date-fns";
import Buttons from "./buttons";
import Volume from "./volume";
import useStorage from "../../hooks/useSessionStorage";
import { useMusicControls } from "./functions";
import {
  selectSongInfo,
  selectSongToPlay,
  selectVolume,
  selectNext,
  setVolume,
  setNext,
} from "../../redux/playerSlice";
import MusicPlayerNeedsLogin from "./needsLogin";

function MusicPlayer() {
  const dispatch = useDispatch();
  const { getItem, setItem } = useStorage();
  const { nextSong, prevSong } = useMusicControls();
  const { data: session, status }: any = useSession();
  const songDetails = useSelector(selectSongInfo);
  const [accessToken, setAccessToken] = useState<any>("");
  const [tokenExpires, setTokenExpires] = useState<any>();
  const songToPlay = useSelector(selectSongToPlay);
  const volume = useSelector(selectVolume);
  const next = useSelector(selectNext);
  useEffect(() => {
    const oldV = getItem("volume");
    dispatch(setVolume(parseFloat(oldV || "0.1")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save volume to localstorage
  useEffect(() => {
    if (volume) setItem("volume", volume.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  const get = useCallback(async () => {
    await fetch("/api/refreshtoken?token=" + session.refreshToken).then(
      async (e) => {
        const body = await e.json();
        setAccessToken(body.accessToken);
        setTokenExpires(body.expiresAt);
      }
    );
  }, [session]);

  useEffect(() => {
    if (next) nextSong();
    return () => {
      dispatch(setNext(false));
    };
  }, [dispatch, next, nextSong]);

  useEffect(() => {
    if (session) {
      setTokenExpires(session.expiresAt);
      if (isPast(new Date(session.expiresAt * 1000))) {
        get();
      } else {
        setAccessToken(session.accessToken);
      }
    }
  }, [get, session]);

  if (!session) return <MusicPlayerNeedsLogin />;
  return (
    <>
      <div className="flex">
        <div className="flex md:gap-[20%] shadow-xl items-center bg-neutral-800 p-2 rounded w-full justify-between ml-[2px] mr-[2px]">
          {/* <div>{JSON.stringify(songDetails)}</div> */}
          {songDetails && songDetails.song ? (
            <div className="flex gap-2 md:w-[10%]">
              {songDetails.song.image === "" ? (
                <Image
                  src="/frog.png"
                  className="bg-neutral-900 h-[50px] w-[50px] shadow-md shadow-neutral-900/100"
                  alt="tets"
                  height={50}
                  width={50}
                />
              ) : (
                <Image
                  className="bg-neutral-900 h-[50px] w-[50px] shadow-md shadow-neutral-900/100"
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
                  {songDetails.artists &&
                    songDetails.artists.map((e: any, i: any) => {
                      return (
                        <Link
                          key={i}
                          href={e.uri}
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
          <Buttons />
          <div className="hidden md:flex">{<Volume />}</div>
        </div>
      </div>

      {session && accessToken && (
        <div className="-z-10 absolute opacity-100">
          <SpotifyPlayer token={accessToken} />
          <SoundCloudPlayerComp />
        </div>
      )}
    </>
  );
}

export default MusicPlayer;
