import { Tag, Button, Spinner, Switch, Icon } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import PlaylistComp from "./playlist";
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
import useSWR from "swr";
import { fetcher } from "../pages";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
function Navbar(props: any) {

  const { data: lastscan, error: ls_error } = useSWR(`/api/scans`, fetcher, {
    refreshInterval: 60000,
  });

  const lastScanState = lastscan ? formatDistanceToNow(new Date(lastscan.data.createdAt), {
    addSuffix: true, includeSeconds: true
  }) : "loading"

  return (
    <nav className="flex py-3 items-center sm:gap-3 justify-between border-b-1 border-neutral-700">
      <div className="flex sm:gap-3 items-center relative">
        <h1 className="text-xl ml-2">
          {(process.env.NEXT_PUBLIC_TITLE as string) || "frogstalk"}
        </h1>
        <Popover2
          minimal
          content={
            <div className="p-2 bg-neutral-900 leading-relaxed">
              <h3 className="text-lg">What is this?</h3>
              <span className="font-bold">
                Spoty-stalk help you stalk someones public playlists.
              </span>
              <p>
                {" "}
                Rather than going into every playlist and looking for newly
                added songs <br /> you can use this website to check for new
                songs over all playlists
              </p>
              <h3 className="text-lg">How does this work?</h3>

              <span className="font-bold">
                We check all playlist every minute and check for new songs.
              </span>
              <p>
                When you visit this page we set a cookie that can be read when
                you revisit later.
                <br />
                Songs that have been added in between ur last visit will marked
                here with a <Tag intent="success">NEW</Tag> tag.
              </p>
            </div>
          }
        >
          <Button minimal icon="info-sign" className="opacity-50" />
        </Popover2>

        <div className="!absolute -right-10">
          {props.isFetching && <Spinner size={20} />}
        </div>
        <PlaylistComp className="!hidden sm:!block" openInApp={props.openInApp} />

      </div>
      {lastScanState && lastScanState !== null && (
          <div className="text-xs">
            {`last scan 
            ${lastScanState}`}
          </div>
        )}
      <div className="flex gap-3 items-center">
        
        <div className="flex items-center gap-3">
          <div>
            <Tooltip2
              content={
                props.openInApp
                  ? "Links will be opened in app"
                  : "Links will get opened in web.spotify"
              }
            >
              <Switch
                className="!m-0 p-0 flex items-center"
                value={props.openInApp}
                onChange={() => props.setOpenInApp(!props.openInApp)}
                labelElement={
                  <span className="m-0 p-0">
                    {props.openInApp ? (
                      <Spotify
                        fill={"#1DB954"}
                        className={
                          "mix-blend-difference opacity-50 inline-block -mt-[5px]"
                        }
                        height={16}
                        width={16}
                      />
                    ) : (
                      <Share
                        fill={"#ffffff"}
                        className={
                          "mix-blend-difference opacity-50 inline-block -mt-[5px]"
                        }
                        height={14}
                        width={16}
                      />
                    )}
                  </span>
                }
              ></Switch>
            </Tooltip2>
          </div>
          <div>
            <Tooltip2 content={"Hide discover weekly playlist"}>
              <Switch
                value={props.hideDiscoverWeekly}
                defaultChecked={props.hideDiscoverWeekly}
                onChange={() =>
                  props.setHideDiscoverWeekly(!props.hideDiscoverWeekly)
                }
                labelElement={
                  <span className="m-0 p-0">
                    <Icon icon="eye-off" />
                  </span>
                }
                className="!m-0 p-0"
              ></Switch>
            </Tooltip2>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
