import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  Button, Tag,
} from "@blueprintjs/core";
import { format, formatDistance, isBefore } from "date-fns";
import { setCookie, getCookie } from "cookies-next";

import Soundcloud from "../public/soundcloud.svg"
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
import LoadingComp from "../components/loading";
import React from "react";
import Navbar from "../components/navbar";
import Head from "next/head";
import { useSelector } from "react-redux";
import { selectLastVisit, selectOpenInApp, selectShowDiscoverWeekly, selectShowSoundCloud, selectShowSpotify, setLastVisit } from "../redux/settingSlice";
import Nodata from "../components/nodata";
import NewTag from "../components/newtag";
import SoundcloudItem from "../components/soundcloudItem";
import SpotifyItem from "../components/spotifyItem";
import PreviewSC from "../components/previewSC";
import PreviewSP from "../components/previewSP";
import Link from "next/link";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
const pageSize = 50;

export default function Web() {
  const queryClient = useQueryClient()
  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly)
  const openInApp = useSelector(selectOpenInApp)
  const showSpotify = useSelector(selectShowSpotify)
  const showSoundcloud = useSelector(selectShowSoundCloud)
  const lastVisit = useSelector(selectLastVisit)
  const { ref, inView } = useInView();
  // const [hideDiscoverWeekly, setHideDiscoverWeekly] = useState<any>(true)
  const { data: topartists, error: pl_error } = useSWR(
    `/api/artists`,
    fetcher
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching
  }: any = useInfiniteQuery(
    ["recommended"],
    async ({ pageParam = 0 }) => {
      const res = await axios.get(
        "/api/recommended?c=" + pageParam + "&p=" + pageSize
      );
      return res.data;
    },
    {
      refetchInterval: 60000,
      getPreviousPageParam: (firstPage) => firstPage.previusCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // const onChange = useCallback(
  //   async () => {
  //     if (!isFetching) queryClient.removeQueries({ queryKey: ['songs'], type: 'active' })
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [isFetching, queryClient, showSpotify, showSoundcloud],
  // )

  //   useEffect(()=>{
  //     onChange()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   },[showSpotify, showSoundcloud])

  useEffect(() => {
    return () => {
      setCookie("left", new Date());
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setNow(format(new Date(), "MM/dd/yyyy - h:m:ss"));
  //   }, 1000);
  // }, [now]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);


  // if (!data) return <LoadingComp />;
  return (
    <><Head>
      <title>frogTech.dev</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head><div className="min-h-screen w-full bg-neutral-900 bp4-dark">
        <div className="container mx-auto p-1">
          <Navbar isFetching={isFetching} />
          <div className="mt-2">
            <div className="pr-2 flex gap-3 flex-wrap text-white overflow-scroll max-h-[calc(100vh-70px)]">
              {data &&
                data.pages.map((page: any) => {
                  if (page.data.length === 0)
                    return (<Nodata />);
                  return (
                    <React.Fragment key={page.nextCursor}>
                      {page.data.map((song: any, index: any) => {
                        return (
                          <div
                            key={index}
                            className=" max-w-full duration-200 shadow-md rounded flex flex-col relative grow"
                          >
                            <div className="!z-10 w-full p-2 bg-opacity-90 items-center gap-2 rounded bg-neutral-800">
                              <div className="flex gap-2 justify-start items-center">

                                {song.source === "soundcloud" ? <PreviewSC id={song.url.split('/').pop()} />
                                  : <PreviewSP url={song.url} />}

                                <h4 title={song.name} className="text-white leading-relaxed mix-blend-difference text-[15px] truncate max-w-[50%] font-semibold">
                                  {song.title}

                                </h4>
                                {song.source === "soundcloud" &&
                                <Link href={"https://soundcloud.com/" + new URL(song.externalUrl).pathname.split('/')[1]}>
                                <Tag
                                minimal
                                >
                                  {song.type === "playlist" ? "Playlist" : song.artist}
                                </Tag>
                                </Link>
                                }
                                {song.source === "spotify" &&
                                <>
                                  {
                                  <Tag
                                  minimal
                                  intent={song.type === "playlist" ? "warning" : song.type === "artist" ? "danger" : song.type === "album" ? "primary" : "none"}
                                  >
                                    {song.type === "playlist" ? "Playlist" : song.artist}
                                  </Tag>
                                  }
                                </>

                                }
                              </div>
                              <div className="flex ml-8 gap-3 items-center justify-between grow text-neutral-300 text-xs text-left">
                                <div>
                              {isBefore(
                                new Date(lastVisit),
                                new Date(song.addedAt)
                              ) && <NewTag/>}
                                </div>
                              <div className="flex justify-between grow">
                                {`recommended 
                                ${formatDistance(
                                  new Date(song.addedAt),
                                  new Date(),
                                  {
                                    addSuffix: true,
                                  }
                                )}`}
                                {song.source === "spotify" ?
                                  openInApp ? (
                                    <Link href={`spotify:${new URL(song.externalUrl).pathname.split('/')[1]}:${new URL(song.externalUrl).pathname.split('/')[2]}`}>
                                      <Spotify
                                        fill={"#1DB954"}
                                        className={"mix-blend-difference opacity-50"}
                                        height={14}
                                        width={14} />
                                    </Link>

                                    ) : (
                                      <Link href={song.externalUrl}>
                                        <Share
                                          fill={"#ffffff"}
                                          className={"mix-blend-difference opacity-50"}
                                          height={14}
                                          width={14} />
                                      </Link>
                                    )
                                    :
                                    <Link href={song.externalUrl}>
                                    <Soundcloud height={14} width={14} fill={"#803711"} />
                                  </Link>
                                  }
                              </div>
                              </div>
                            </div>
                            {song.image && (
                              <div
                                className="h-[56px] rounded bg-cover bg-center w-full absolute !z-0 brightness-50"
                                style={{
                                  backgroundImage: `url(${song.image || ""})`,
                                }} />
                            )}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  );
                })}

              {data && data.pages && data.pages[0].data.length !== 0 &&
                <Button
                  disabled={!hasNextPage || isFetching}
                  onClick={() => fetchNextPage()}
                  className="h-[30px]"
                  elementRef={ref}
                  minimal
                  fill
                >
                  {isFetching ? "Loading..." : "Load More"}
                </Button>}
            </div>
          </div>
        </div>
      </div></>
  );
}
