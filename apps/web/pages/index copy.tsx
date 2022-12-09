import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  Button,
} from "@blueprintjs/core";
import { format, formatDistance, formatDistanceToNow, formatISO, fromUnixTime, getUnixTime, isValid, parseISO, subDays } from "date-fns";
import { setCookie, getCookie } from "cookies-next";
import Image from "next/image";
import LoadingComp from "../components/loading";
import React from "react";
import Navbar from "../components/navbar";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { selectLastVisit, selectLoadedSongs, selectOpenInApp, selectShowDiscoverWeekly, selectShowSoundCloud, selectShowSpotify, selectToPlay, setLastVisit, setLoadedSongs, setPlayer, setSpotifySongs } from "../redux/settingSlice";
import Nodata from "../components/nodata";
import NewTag from "../components/newtag";
import SoundcloudItem from "../components/soundcloudItem";
import SpotifyItem from "../components/spotifyItem";
import Router, { useRouter } from "next/router";
import { parseJSON } from "date-fns/esm";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import MusicPlayer from "../components/musicPlayer";
import Layout from "../components/layout";
import Spotify from "../public/spotify.svg";

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
  const toPlay = useSelector(selectToPlay)

  const { ref, inView } = useInView();
  // const MusicPlayer = dynamic(() => import("../components/musicPlayer"), {
  //   ssr: false,
  // })
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
      // refetchOnWindowFocus: false,
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

  const loadedSongsMapped = useMemo(() => {
    if (data) {
      return data.pages.flatMap((page: any) => {
        if (page) {
          return page.data.map((song: any) => {
            if (song.source === "spotify") {
              return `spotify:track:${song.sid}`
            } else {
              return [song.externalUrl, song.name, song.artists]
            }
          })
        }
      })
    }
  }, [data])



  const spotySongs = useMemo(() => {
    if (!loadedSongsMapped) return
    return loadedSongsMapped.map((e: any) => {
      if (!e.includes('spotify:')) {
        return 'spotify:track:xxxxxxxxxxxxxxxxxxxxxx'
      } else {
        return e
      }
    })
  }, [loadedSongsMapped])
  // create player var


  useEffect(() => {
    dispatch(setLoadedSongs(loadedSongsMapped))
  }, [dispatch, loadedSongsMapped])
  useEffect(() => {
    dispatch(setSpotifySongs(spotySongs))
  }, [dispatch, spotySongs])
  // useEffect(()=>{    
  //   dispatch(setPlayer(player))
  // }, [dispatch, player])


  // if (!data) return <LoadingComp />;

  return (
    <><Head>
      <title>Home - frogTech.dev</title>
      <meta name="description" content="Music discovery app for frogs" />
      <meta property="og:url" content="https://pokeing.frogtech.dev" />
      <meta property="og:title" content="Home - frogTech.dev" />
      <meta property="og:image" content="https://pokeing.frogtech.dev/social.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="pokeing.frogtech.dev" />
      <meta property="twitter:url" content="https://pokeing.frogtech.dev" />
      <meta name="twitter:title" content="Home - frogTech.dev" />
      <meta name="twitter:description" content="Generated by create next app" />
      <meta name="twitter:image" content="https://pokeing.frogtech.dev/social.png" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
      <Layout>
        <div className="mt-2">
          <div className="pr-2 flex gap-3 flex-wrap text-white overflow-scroll h-[calc(100vh-130px)] max-h-[calc(100vh-130px)]">
           
            {data &&
              data.pages.map((page: any, pageIndex: any) => {
                if (page.data.length === 0)
                  return (<Nodata />);
                return (
                  <React.Fragment key={page.nextCursor}>
                    {page.data.map((song: any, songIndex: any) => {
                      if (song.source === "soundcloud") {
                        return <SoundcloudItem
                          key={songIndex}
                          lastVisit={lastVisit}
                          pageIndex={pageIndex}
                          song={song}
                          songIndex={songIndex} />;
                      } else if (song.source === "spotify") {
                        if (song.playlists[0].name.includes('Discover Weekly') && !showDiscoverWeekly)
                          return;
                        return <SpotifyItem
                          song={song}
                          key={songIndex}

                          pageIndex={pageIndex}
                          songIndex={songIndex}
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
      </Layout>
    </>
  );
}

