import { Tag, Button, Spinner, Switch, Icon, ButtonGroup } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import PlaylistComp from "./playlist";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../pages";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Settings from "./settings";
import Image from "next/image";
import Github from "../public/github.svg"
import Info from "./info";
import Reddit from "../public/reddit.svg"
import { useRouter } from "next/router";
function Navbar(props: any) {
  const router = useRouter()
  const { data: lastscan, error: ls_error } = useSWR(`/api/scans`, fetcher, {
    refreshInterval: 60000,
  });

  const lastScanState = (lastscan && lastscan.data) ? formatDistanceToNow(new Date(lastscan.data.createdAt), {
    addSuffix: true, includeSeconds: true
  }) : "loading"

  return (
    <nav className="flex py-3 items-center sm:gap-3 justify-between border-b-1 border-neutral-700">
      <div className="flex sm:gap-3 items-center relative">
        <div className="flex items-center gap-3">
          <h1 className="text-xl">
            {(process.env.NEXT_PUBLIC_TITLE as string) || "frogstalk"}
          </h1>
          <div className="flex gap-2 text-xs opacity-70 items-center">
            <span>by</span>
            <Link href={"https://frogtech.dev"} >
              frogtech
            </Link>
            <div className="rounded w-1 h-1 bg-slate-200 animate-pulse"></div>
            <div>
              {`last scan ${lastScanState}`}
            </div>
            <div>
            </div>
          </div>
        </div>
        {lastScanState && lastScanState !== null && (
          <div className="text-xs opacity-70">

          </div>
        )}
        {/* <div className="!absolute -right-10">
          {props.isFetching && <Spinner size={20} />}
        </div> */}
      </div>
      <Info/>
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-3">
          
        <ButtonGroup className="navbuttons">
         
          <Link href="/" >
           <Button active={router.pathname === "/"} className="!bg-neutral-800"  icon="home">
            Home
          </Button>
          </Link>
          
          <Tooltip2
            content={
                <span className="text-xs"><Tag intent="none">Songs</Tag>, <Tag intent="warning">Playlists</Tag>,<Tag intent="primary"> Albums</Tag> and <Tag intent="danger">Artist</Tag>  posted on the subreddit</span>

              }          
          >
          <Link  href="/recommended">
          <Button className="!bg-neutral-800" active={router.pathname === "/recommended"} rightIcon={<Reddit height={20} width={20} fill={"#C6C6C6"} />}>Recommended</Button>
          </Link>
          </Tooltip2>
          <PlaylistComp className="!bg-neutral-800" openInApp={props.openInApp} />
          <Settings />
          </ButtonGroup>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
