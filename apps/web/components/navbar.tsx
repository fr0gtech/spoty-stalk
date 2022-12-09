import {
  Tag,
  Button,
  Spinner,
  Switch,
  Icon,
  ButtonGroup,
  Divider,
  FormGroup,
  Checkbox,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import PlaylistComp from "./playlist";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../pages";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Settings from "./settings";
import Image from "next/image";
import Github from "../public/github.svg";
import Info from "./info";
import Reddit from "../public/reddit.svg";
import { useRouter } from "next/router";
import LoginComp from "./login";
import { signIn, signOut, useSession } from "next-auth/react";
import Spotify from "../public/spotify.svg";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import {
  selectShowDiscoverWeekly,
  selectOpenInApp,
  selectShowSpotify,
  selectShowSoundCloud,
  setShowSpotify,
  setShowSoundCloud,
} from "../redux/settingSlice";

function Navbar(props: any) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly);
  const openInapp = useSelector(selectOpenInApp);
  const showSpotify = useSelector(selectShowSpotify);
  const showSoundclud = useSelector(selectShowSoundCloud);
  const { data: session, status }: any = useSession();

  const router = useRouter();
  const { data: lastscan, error: ls_error } = useSWR(`/api/scans`, fetcher, {
    refreshInterval: 60000,
  });

  const lastScanState =
    lastscan && lastscan.data
      ? formatDistanceToNow(new Date(lastscan.data.updatedAt), {
          addSuffix: true,
          includeSeconds: true,
        })
      : "loading";

  return (
    <nav className="flex items-center sm:gap-3 justify-between border-b-1 border-neutral-700">
      <div className="flex sm:gap-3 items-center relative">
        <div className="flex items-center gap-3">
          <ButtonGroup minimal className="navbuttons gap-1 items-center">
            <Link href="/" className="!text-white !no-underline">
              <Button
                small
                active={router.pathname === "/"}
                className="!bg-neutral-800"
              >
                <h1 className="font-bold">
                  {(process.env.NEXT_PUBLIC_TITLE as string) || "frogstalk"}
                </h1>
              </Button>
            </Link>

            <Link href="/recommended">
              <Button
                small
                className="!bg-neutral-800"
                active={router.pathname === "/recommended"}
                rightIcon={
                  <Popover2
                    interactionKind="hover"
                    minimal
                    className=""
                    position="bottom"
                    content={
                      <div className="!bg-neutral-800 p-3">
                        <span className="gap-1 text-xs flex">
                          <Tag minimal intent="none">
                            Songs
                          </Tag>
                          ,
                          <Tag minimal intent="warning">
                            Playlists
                          </Tag>
                          ,
                          <Tag minimal intent="primary">
                            {" "}
                            Albums
                          </Tag>{" "}
                          and
                          <Tag minimal intent="danger">
                            Artist
                          </Tag>
                          posted on the subreddit
                        </span>
                      </div>
                    }
                  >
                    <Icon
                      className="!ml-[2px] !mr-[1px] opacity-40"
                      icon="info-sign"
                    />
                  </Popover2>
                }
              >
                Recommended
              </Button>
            </Link>
            <PlaylistComp
              className="!bg-neutral-800"
              openInApp={props.openInApp}
            />
          </ButtonGroup>
          {/* <LoginComp/> */}

          <div className="flex gap-2 text-xs opacity-70 items-center">
            <span>by</span>
            <Link href={"https://frogtech.dev"} className="!text-white">
              frogtech
            </Link>
          </div>
        </div>
      </div>
      <div className="text-xs opacity-50">{`last scan ${lastScanState}`}</div>
      <div className="flex">
        <div id="spcheck" className="text-xs">
          <Checkbox
            inline
            checked={showSpotify}
            label="Spotify"
            onChange={() => {
              queryClient.removeQueries({
                queryKey: ["songs"],
                type: "active",
              });
              dispatch(setShowSpotify(!showSpotify));
            }}
          />
        </div>
        <div id="sccheck" className="text-xs">
          <Checkbox
            checked={showSoundclud}
            label="Soundcloud"
            onChange={() => {
              queryClient.removeQueries({
                queryKey: ["songs"],
                type: "active",
              });
              dispatch(setShowSoundCloud(!showSoundclud));
            }}
          />
        </div>
      </div>
      <div className="mr-2">
        
        <Settings />
      </div>
    </nav>
  );
}
export default Navbar;
