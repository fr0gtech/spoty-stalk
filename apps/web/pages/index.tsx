import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Button } from "@blueprintjs/core";
import { formatDistance, isBefore, subDays } from "date-fns";
import { setCookie, getCookie } from "cookies-next";
import Image from "next/image";
import LoadingComp from "../components/loading";
import React from "react";
import Navbar from "../components/navbar";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOpenInApp,
  selectPlayerReady,
  selectShowDiscoverWeekly,
  selectShowSoundCloud,
  selectShowSpotify,
  selectSongPlaying,
  selectToPlay,
  setLoadedSongs,
  setSpotifySongs,
  setToPlay,
} from "../redux/settingSlice";
import Nodata from "../components/musicItem/nodata";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Spotify from "../public/spotify.svg";
import Soundcloud from "../public/soundcloud.svg";
import dynamic from "next/dynamic";
import { Toast } from "../components/toaster";
import PreviewSC from "../components/musicItem/previewSC";
import Preview from "../components/musicItem/preview";
import { useSession } from "next-auth/react";
import MusicPlayer from "../components/musicPlayer";
import Link from "next/link";
import NewTag from "../components/musicItem/newtag";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
const pageSize = 100;
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const ready = useSelector(selectPlayerReady);

  const [lastVisit, setLastVisit] = useState<any>();
  const queryClient = useQueryClient();
  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly);
  const openInApp = useSelector(selectOpenInApp);
  const showSpotify = useSelector(selectShowSpotify);
  const showSoundcloud = useSelector(selectShowSoundCloud);
  const toPlay = useSelector(selectToPlay);
  const songPlaying = useSelector(selectSongPlaying);
  const { ref, inView } = useInView();
  const { data: session, status }: any = useSession();

  // const [hideDiscoverWeekly, setHideDiscoverWeekly] = useState<any>(true)
  const { data: topartists, error: pl_error } = useSWR(`/api/artists`, fetcher);
  const { data, fetchNextPage, hasNextPage, isFetching }: any =
    useInfiniteQuery(
      ["songs"],
      async ({ pageParam = 0 }) => {
        const res = await axios.get(
          "/api/songs?c=" +
            pageParam +
            "&p=" +
            pageSize +
            "&sp=" +
            showSpotify +
            "&sc=" +
            showSoundcloud
        );
        return res.data;
      },
      {
        // refetchOnWindowFocus: false,
        refetchInterval: 60000,
        getPreviousPageParam: (firstPage) => firstPage.previusCursor,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    setLastVisit((getCookie(router.pathname) as any) || new Date());
    return () => {
      setCookie(router.pathname, new Date());
    };
  }, [router.pathname]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const topartistsname = useMemo(() => {
    if (topartists) {
      return topartists.data.map((artist: any) => artist.name);
    }
  }, [topartists]);

  const loadedSongsMapped = useMemo(() => {
    if (data) {
      return data.pages.flatMap((page: any) => {
        if (page) {
          return page.data.map((song: any) => {
            if (song.source === "spotify") {
              return `${song.sid}`;
            } else {
              return song.externalUrl;
            }
          });
        }
      });
    }
  }, [data]);

  // create player var

  useEffect(() => {
    dispatch(setLoadedSongs(loadedSongsMapped));
  }, [dispatch, loadedSongsMapped]);
  // if (!data) return <LoadingComp />;

  return (
    <>
      <Head>
        <title>Home - frogTech.dev</title>
        <meta name="description" content="Music discovery app for frogs" />
        <meta property="og:url" content="https://pokeing.frogtech.dev" />
        <meta property="og:title" content="Home - frogTech.dev" />
        <meta
          property="og:image"
          content="https://pokeing.frogtech.dev/social.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="pokeing.frogtech.dev" />
        <meta property="twitter:url" content="https://pokeing.frogtech.dev" />
        <meta name="twitter:title" content="Home - frogTech.dev" />
        <meta
          name="twitter:description"
          content="Generated by create next app"
        />
        <meta
          name="twitter:image"
          content="https://pokeing.frogtech.dev/social.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="h-[calc(100vh-40px)] min-h-[calc(100vh-40px)] justify-between flex flex-col gap-1">
          <div className="overflow-scroll rounded">
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-8 text-white rounded">
              {!data &&
                [...Array(100)].map((value:any, i:any) => {
                  return (
                    <div key={i} className="w-full h-[72px] bg-neutral-800 bg-opacity-70 rounded p-[2px]">
                      <div className="flex items-center h-full p-2 gap-3">
                        <div>
                          <div className="h-[50px] w-[50px] bg-neutral-800 rounded"></div>
                        </div>
                        <div className=" flex gap-2 flex-col">
                          <div className="w-[80px] h-[15px] bg-neutral-800"></div>
                          <div className="w-[80px] h-[15px] bg-neutral-800"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {data &&
                data.pages.map((page: any, pageIndex: any) => {
                  if (page.data.length === 0) return <Nodata />;
                  return (
                    <React.Fragment key={page.nextCursor}>
                      {page.data.map((song: any, songIndex: any) => {
                        if (
                          song.playlists[0] &&
                          song.playlists[0].name.includes("Discover Weekly") &&
                          !showDiscoverWeekly
                        )
                          return;

                        let isPlaying = false;
                        song.source === "soundcloud"
                          ? (isPlaying = songPlaying === song.externalUrl)
                          : (isPlaying = songPlaying === song.sid);

                        // if (song.source === "soundcloud") {
                        return (
                          // <div className={!ready ? "opacity-0 duration-200" : "opacity-100 duration-500"}>

                          <div
                            key={song.sid}
                            className={
                              isPlaying
                                ? "grow w-full " +
                                  "duration-300 relative transition-all rounded animate-border inline-block from-neutral-300 via-neutral-900 to-neutral-700 bg-[length:400%_400%] p-[2px] bg-gradient-to-r"
                                : "grow w-full " +
                                  "duration-300 relative transition-all rounded animate-border inline-block from-neutral-600 via-neutral-900 to-neutral-700 bg-[length:400%_400%] p-[2px] hover:bg-gradient-to-r"
                            }
                          >
                            {!ready && session && (
                              <div className="absolute bg-neutral-900 opacity-50 z-10 w-full h-full flex justify-center items-center rounded"></div>
                            )}
                            <div
                              className={
                                isPlaying
                                  ? "bg-neutral-700 rounded p-2 h-fit shadow-md cursor-pointer"
                                  : "bg-neutral-800 rounded p-2 h-fit cursor-pointer shadow-md border-neutral-800"
                              }
                              onClick={() => {
                                ready &&
                                  dispatch(
                                    setToPlay(
                                      song.source === "soundcloud"
                                        ? song.externalUrl
                                        : song.sid
                                    )
                                  );
                              }}
                            >
                              <div className="flex gap-3 ">
                                <div className="absolute bg-neutral-800 mx-auto !z-10">
                                  {song.source === "soundcloud" && !session && (
                                    <PreviewSC id={song.sid} />
                                  )}
                                  {song.source === "spotify" && !session && (
                                    <Preview song={song} />
                                  )}
                                </div>
                                {song &&
                                song.images[0] &&
                                song.images[0].url ? (
                                  <div className="relative">
                                    <Image
                                      placeholder="blur"
                                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                        shimmer(50, 50)
                                      )}`}
                                      className="shadow-md"
                                      src={song.images[0].url}
                                      width={50}
                                      height={50}
                                      alt="idk"
                                    />
                                    {isBefore(new Date(lastVisit), new Date(song.addedAt)) && (
                                        <div className="absolute -top-1 -left-1">
                                        <NewTag/>
                                        </div>
                                      )}
                                  </div>
                                ) : song.images.url ? (
                                  <Image
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                      shimmer(50, 50)
                                    )}`}
                                    className="shadow-md"
                                    src={song.images.url}
                                    width={50}
                                    height={50}
                                    alt="idk"
                                  />
                                ) : (
                                  <div className="relative">
                                    <Image
                                      src="/frog.png"
                                      className="bg-neutral-900 h-[50px] w-[50px]"
                                      alt="tets"
                                      height={50}
                                      width={50}
                                    />
                                    {isBefore(new Date(lastVisit), new Date(song.addedAt)) && (
                                      <div className="absolute -top-1 -left-1">
                                      <NewTag/>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="w-[calc(100%-60px)]">
                                  <div className="font-bold flex items-center justify-between gap-2">
                                    <span
                                      title={song.name}
                                      className="truncate"
                                    >
                                      {
                                        song.name
                                          .replace(/\(([^)]+)\)/, "")
                                          .split("-")[0]
                                      }
                                    </span>
                                    {/* {song.source === "spotify" ? (
                                      <div className="opacity-30">
                                        <Spotify
                                          fill={"#1DB954"}
                                          width={21}
                                          height={21}
                                        />
                                      </div>
                                    ) : (
                                      <div className="opacity-60">
                                        <Soundcloud
                                          fill={"#803711"}
                                          width={21}
                                          height={21}
                                        />
                                      </div>
                                    )} */}
                                  </div>
                                  <div
                                    title={song.artists
                                      .map((e: any) => e.name)
                                      .join(", ")}
                                    className="text-xs opacity-70 truncate"
                                  >
                                    {song.artists
                                      .map((e: any) => e.name)
                                      .join(", ")}
                                  </div>
                                  <div className="truncate text-[11px] text-neutral-400">
                                    <div className="flex truncate gap-[2px] items-center">
                                      <div
                                        className="truncate"
                                        title={
                                          song.playlists[0] &&
                                          song.playlists[0].name
                                        }
                                      >
                                        {formatDistance(
                                          new Date(song.addedAt),
                                          new Date(),
                                          {
                                            addSuffix: true,
                                          }
                                        )}
                                        {song.playlists[0] && (
                                          <Link
                                            href={song.playlists[0].externalUrl}
                                            className="!text-neutral-300"
                                          >
                                            {" "}
                                            {song.playlists[0].name}
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              {data && data.pages && data.pages[0].data.length !== 0 && (
                <Button
                  loading={isFetching}
                  disabled={!hasNextPage || isFetching}
                  onClick={() => fetchNextPage()}
                  className="m-[2px] rounded !bg-neutral-800"
                  elementRef={ref}
                  minimal
                  fill
                >
                  {isFetching ? "Loading..." : "Load More"}
                </Button>
              )}
            </div>
          </div>
          <MusicPlayer />
        </div>
      </Layout>
    </>
  );
}
