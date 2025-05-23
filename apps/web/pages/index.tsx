import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Button } from "@blueprintjs/core";
import { formatDistance, isBefore } from "date-fns";
import { setCookie, getCookie } from "cookies-next";
import Image from "next/image";
import React from "react";
import Navbar from "../components/navbar";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHideTimestamp,
  selectOpenInApp,
  selectShowDiscoverWeekly,
  selectShowSoundCloud,
  selectShowSpotify,
} from "../redux/settingSlice";
import Nodata from "../components/musicItem/nodata";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Spotify from "../public/spotify.svg";
import Soundcloud from "../public/soundcloud.svg";
import PreviewSC from "../components/musicItem/previewSC";
import Preview from "../components/musicItem/preview";
import { useSession } from "next-auth/react";
import MusicPlayer from "../components/musicPlayer";
import Link from "next/link";
import NewTag from "../components/musicItem/newtag";
import {
  selectPlay,
  selectReady,
  selectSongInfo,
  selectSongToPlay,
  setLoadedSongs,
  setSongToPlay,
} from "../redux/playerSlice";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
const pageSize = 10;

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const ready = useSelector(selectReady);

  const [lastVisit, setLastVisit] = useState<any>();
  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly);
  const showSpotify = useSelector(selectShowSpotify);
  const showSoundcloud = useSelector(selectShowSoundCloud);
  const hideTimestamp = useSelector(selectHideTimestamp);
  const toPlay = useSelector(selectSongToPlay);
  const songPlaying = toPlay;
  const { ref, inView } = useInView();
  const { data: session, status }: any = useSession();
  const songDetails = useSelector(selectSongInfo);
  const isPlaying = useSelector(selectPlay);
  const [pageTitle, setTitle] = useState<any>();
  const [fullPageTitle, setFullTitle] = useState<any>();
  // const [hideDiscoverWeekly, setHideDiscoverWeekly] = useState<any>(true)
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
            showSoundcloud +
            "&dw=" +
            showDiscoverWeekly
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

  const loadedSongsMapped = useMemo(() => {
    if (data) {
      return data.pages
        .flatMap((page: any) => {
          if (page) {
            return page.data.map((song: any) => {
              if (song.source === "spotify") {
                return `${song.sid}`;
              } else {
                return song.externalUrl;
              }
            });
          }
        })
        .filter(Boolean);
    }
  }, [data]);

  // create player var

  useEffect(() => {
    dispatch(setLoadedSongs(loadedSongsMapped));
  }, [dispatch, loadedSongsMapped]);
  // if (!data) return <LoadingComp />;
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });
  }, []);

  useEffect(() => {
    setTitle(undefined);
  }, [songDetails.song.title]);

  useEffect(() => {
    if (!isPlaying) return;
    const timeOut = setTimeout(() => {
      if (pageTitle) {
        setTitle(pageTitle.slice(1));
      } else {
        setFullTitle(
          `${songDetails.song.title} by ${songDetails.artists[0].name}`
        );
        setTitle(`${songDetails.song.title} by ${songDetails.artists[0].name}`);
      }
    }, 400);
    return () => clearTimeout(timeOut);
  }, [
    fullPageTitle,
    isPlaying,
    pageTitle,
    songDetails.artists,
    songDetails.song.title,
  ]);

  const title = `${isPlaying ? "⏸️" : "▶️"} ${
    pageTitle ? pageTitle : "Home"
  } - frogTech.dev`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <link id="favicon" rel="icon" href="/favicon.ico" />
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
      </Head>
      <Layout>
        <div className="h-[calc(100vh-40px)] min-h-[calc(100vh-40px)] justify-between flex flex-col gap-1">
          <div className="overflow-scroll rounded">
            <div className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-white rounded">
              {!data &&
                [...Array(10)].map((value: any, i: any) => {
                  return (
                    <div
                      key={i}
                      className="grow w-full col-span-12 duration-300 relative transition-all rounded inline-block from-neutral-600 via-neutral-900 to-neutral-700 bg-[length:400%_400%] p-[2px] hover:bg-gradient-to-r"
                    >
                      <div className=" bg-neutral-800 rounded justify-between flex items-center h-full p-2 gap-3">
                        <div className="flex gap-2">
                          <div>
                            <div className="h-[50px] w-[50px] bg-neutral-700 rounded"></div>
                          </div>
                          <div className=" flex gap-2 flex-col">
                            <div className="w-[80px] h-[15px] bg-neutral-700"></div>
                            <div className="w-[80px] h-[15px] bg-neutral-700"></div>
                          </div>
                          <div></div>
                        </div>
                        <div className="w-[80px] h-[15px] bg-neutral-700"></div>
                        <div className="w-[80px] h-[15px] bg-neutral-700"></div>
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
                        let isPlaying = false;
                        song.source === "soundcloud"
                          ? (isPlaying = songPlaying === song.externalUrl)
                          : (isPlaying = songPlaying === song.sid);
                        return (
                          <div
                            key={song.sid}
                            className={
                              isPlaying
                                ? "grow w-full col-span-12 " +
                                  "duration-300 relative transition-all rounded inline-block from-neutral-600 via-neutral-900 to-neutral-700 bg-[length:400%_400%] p-[2px] bg-gradient-to-r"
                                : "grow w-full col-span-12 " +
                                  "duration-300 relative transition-all rounded inline-block from-neutral-600 via-neutral-900 to-neutral-700 bg-[length:400%_400%] p-[2px] hover:bg-gradient-to-r"
                            }
                          >
                            {!ready && session && (
                              <div className="absolute bg-neutral-900 opacity-50 z-10 w-full h-full flex justify-center items-center rounded"></div>
                            )}
                            <div
                              className={
                                isPlaying
                                  ? "flex flex-col gap-1 bg-neutral-800/70 rounded p-2 h-fit shadow-md cursor-pointer"
                                  : "flex flex-col gap-1 bg-neutral-800 rounded p-2 h-fit cursor-pointer shadow-md border-neutral-800"
                              }
                              onClick={() => {
                                ready &&
                                  dispatch(
                                    setSongToPlay(
                                      song.source === "soundcloud"
                                        ? song.externalUrl
                                        : song.sid
                                    )
                                  );
                              }}
                            >
                              <div className="flex justify-between">
                                <div className="flex justify-between w-[50%] items-center">
                                  <div className="flex gap-5">
                                    {song &&
                                    song.images[0] &&
                                    song.images[0].url ? (
                                      <Image
                                        className="shadow-md"
                                        src={song.images[0].url}
                                        width={50}
                                        height={50}
                                        alt="idk"
                                      />
                                    ) : song.images.url ? (
                                      <Image
                                        className="shadow-md h-[50px] w-[50px]"
                                        src={song.images.url}
                                        width={50}
                                        height={50}
                                        alt="idk"
                                      />
                                    ) : (
                                      <Image
                                        src="/frog.png"
                                        className="bg-neutral-900 h-[50px] w-[50px]"
                                        alt="tets"
                                        height={50}
                                        width={50}
                                      />
                                    )}

                                    <div className="col-span-4">
                                      <div className="font-bold flex items-center justify-between gap-2">
                                        <span
                                          title={song.name}
                                          className="truncate max-w-[100%]"
                                        >
                                          {song.name}
                                        </span>
                                      </div>

                                      <div
                                        title={song.artists
                                          .map((e: any) => e.name)
                                          .join(", ")}
                                        className="text-xs text-neutral-400 truncate"
                                      >
                                        {song.artists
                                          .map((e: any) => e.name)
                                          .join(", ")}
                                      </div>
                                      <div
                                        title={song.album && song.album.name}
                                        className="text-[11px] text-neutral-500 truncate"
                                      >
                                        {song.album
                                          ? song.album.name
                                          : "Yo pls"}
                                      </div>
                                    </div>
                                  </div>

                                  {!hideTimestamp && (
                                    <div className="truncate w-[20%] text-neutral-400">
                                      <div className="flex truncate gap-1 items-center">
                                        {song.source === "soundcloud" &&
                                          !session && (
                                            <PreviewSC id={song.sid} />
                                          )}
                                        {song.source === "spotify" &&
                                          !session && <Preview song={song} />}
                                        {isBefore(
                                          new Date(lastVisit),
                                          new Date(song.addedAt)
                                        ) && <NewTag />}

                                        <div
                                          className="truncate w-full"
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
                                              href={
                                                song.playlists[0].externalUrl
                                              }
                                              className="!text-neutral-400"
                                            >
                                              {" "}
                                              {song.playlists[0].name}
                                            </Link>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-center ">
                                  <Link
                                    href={song.externalUrl}
                                    className="!text-neutral-200 !no-underline text-[14px]"
                                  >
                                    {song.source === "spotify" ? (
                                      <div className="flex w-[200px] rounded-full justify-start items-center ">
                                        <div className="p-[15px]">
                                          <Spotify
                                            className="!fill-[#ffffff] w-[22px] h-[22px]"
                                            fill="#ffffff"
                                            height={22}
                                            width={22}
                                          />
                                        </div>
                                        <div className="uppercase font-bold">
                                          Open Spotify
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex w-[200px] rounded-full justify-start items-center">
                                        <div className="p-[15px]">
                                          <Soundcloud
                                            fill="#ffffff"
                                            height={21}
                                            width={21}
                                          />
                                        </div>
                                        <div className="uppercase font-bold">
                                          Open Soundcloud
                                        </div>
                                      </div>
                                    )}
                                  </Link>
                                </div>
                              </div>
                              {/* <div className="absolute bg-neutral-800 mx-auto !z-10">
                                  {song.source === "soundcloud" && !session && (
                                    <PreviewSC id={song.sid} />
                                  )}
                                  {song.source === "spotify" && !session && (
                                    <Preview song={song} />
                                  )}
                                </div> */}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              {data && data.pages && data.pages[0].data.length !== 0 && (
                <div
                  className={
                    "grow col-span-12 mx-[2px] duration-300 relative transition-all rounded"
                  }
                >
                  <div
                    className={
                      "flex gap-3 bg-neutral-800 rounded cursor-pointer shadow-md border-neutral-800"
                    }
                  >
                    {/* <div className="flex flex-col justify-center items-center bg-neutral-700/50 hover:bg-neutral-700 rounded w-fit p-3">
                      <div className="p-[12px]">
                        <Spotify
                          className="!fill-[#ffffff] w-[22px] h-[22px]"
                          fill="#ffffff"
                          height={22}
                          width={22}
                        />
                      </div>
                      <div className="uppercase font-bold">Open Spotify</div>
                    </div> */}
                    <Button
                      loading={isFetching}
                      disabled={!hasNextPage || isFetching}
                      onClick={() => fetchNextPage()}
                      className="!p-4"
                      elementRef={ref}
                      icon="more"
                      minimal
                      fill
                    >
                      {isFetching ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                </div>
              )}

              {/* {data && data.pages && data.pages[0].data.length !== 0 && (
                <Button
                  loading={isFetching}
                  disabled={!hasNextPage || isFetching}
                  onClick={() => fetchNextPage()}
                  className="m-[2px] !px-[10px] w-full col-span-12 rounded-xl h-[60px] !bg-neutral-800"
                  elementRef={ref}
                  minimal
                  fill
                >
                  {isFetching ? "Loading..." : "Load More"}
                </Button>
              )} */}
            </div>
          </div>
          <MusicPlayer />
        </div>
      </Layout>
    </>
  );
}
