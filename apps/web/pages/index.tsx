import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  Button,
} from "@blueprintjs/core";
import { format, formatDistance, formatDistanceToNow, formatISO, fromUnixTime, getUnixTime, isValid, parseISO, subDays  } from "date-fns";
import { setCookie, getCookie } from "cookies-next";


import LoadingComp from "../components/loading";
import React from "react";
import Navbar from "../components/navbar";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { selectLastVisit, selectOpenInApp, selectShowDiscoverWeekly, selectShowSoundCloud, selectShowSpotify, setLastVisit } from "../redux/settingSlice";
import Nodata from "../components/nodata";
import NewTag from "../components/newtag";
import SoundcloudItem from "../components/soundcloudItem";
import SpotifyItem from "../components/spotifyItem";
import { useRouter } from "next/router";
import { parseJSON } from "date-fns/esm";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
const pageSize = 50;

export default function Web() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [lastVisit, setLastVisit] = useState<any>()
  const queryClient = useQueryClient()
  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly)
  const openInApp = useSelector(selectOpenInApp)
  const showSpotify = useSelector(selectShowSpotify)
  const showSoundcloud = useSelector(selectShowSoundCloud)
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
    ["songs"],
    async ({ pageParam = 0 }) => {
      const res = await axios.get(
        "/api/songs?c=" + pageParam + "&p=" + pageSize + "&sp=" + showSpotify + "&sc=" + showSoundcloud
      );
      return res.data;
    },
    {
      refetchInterval: 60000,
      getPreviousPageParam: (firstPage) => firstPage.previusCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    setLastVisit(getCookie(router.pathname) as any || new Date());
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
      return topartists.data.map((artist: any) => artist.name)
    }
  }, [topartists])
  
  // if (!data) return <LoadingComp />;
  return (
    <><Head>
      <title>frogTech.dev</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head><div className="min-h-screen w-full bg-neutral-900 bp4-dark">
        <div className="container mx-auto p-1">
          <Navbar isFetching={isFetching} lastVisit={lastVisit} />
          
          <div className="mt-2">
            <div className="pr-2 flex gap-3 flex-wrap text-white overflow-scroll max-h-[calc(100vh-70px)]">
              {data &&
                data.pages.map((page: any) => {
                  if (page.data.length === 0)
                    return (<Nodata />);
                  return (
                    <React.Fragment key={page.nextCursor}>
                      {page.data.map((song: any, index: any) => {
                        if (song.source === "soundcloud") {
                          return <SoundcloudItem
                            lastVisit={lastVisit}
                            song={song}
                            index={index} />;
                        } else if (song.source === "spotify") {
                          if (song.playlists[0].name.includes('Discover Weekly') && !showDiscoverWeekly)
                            return;
                          return <SpotifyItem
                            song={song}
                            index={index}
                            openInApp={openInApp}
                            topartistsname={topartistsname}
                            lastVisit={lastVisit} />;
                        }
                      })}
                    </React.Fragment>
                  );
                })}

              {data && data.pages && data.pages[0].data.length !== 0 &&
                <Button
                  loading={isFetching}
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

