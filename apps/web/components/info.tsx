import {
  Button,
  Checkbox,
  FormGroup,
  Icon,
  InputGroup,
  Slider,
  Switch,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useDispatch, useSelector } from "react-redux";
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
import {
  selectHideTimestamp,
  selectOpenInApp,
  selectShowDiscoverWeekly,
  selectShowSoundCloud,
  selectShowSpotify,
  setHideTimestamp,
  setOpenInApp,
  setShowDiscoverWeekly,
  setShowSoundCloud,
  setShowSpotify,
} from "../redux/settingSlice";
import { useQueryClient } from "@tanstack/react-query";
import Github from "../public/github.svg";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
function Info() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: session, status }: any = useSession();

  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly);
  const openInapp = useSelector(selectOpenInApp);
  const hideTimestamp = useSelector(selectHideTimestamp);
  const showSpotify = useSelector(selectShowSpotify);
  const showSoundclud = useSelector(selectShowSoundCloud);
  return (
    <Popover2
      minimal
      content={
        <div className="p-3 bg-neutral-800">
          <div className="flex justify-between items-start">
            <h3 className="text-xl mb-2 font-bold">Info</h3>
          </div>
          <p className="text-base">We stalk spotify playlist adds and soundcloud likes. <br />
            New songs will also be posted on <Link href="https://twitter.com/ingPOKE">@inkPOKE</Link> on twitter </p>

          <div className="flex justify-between items-start">
            <h3 className="text-xl mb-2 font-bold">Why</h3>
          </div>
          <p className="text-base">This should help to find new music across platforms. </p>

          <div className="flex justify-between items-start">
            <h3 className="text-xl mb-2 font-bold">How</h3>
          </div>
          <p className="text-base">Check out <Link
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USER as string
              }/${process.env.NEXT_PUBLIC_GITHUB_REPO}`}
          >
            <Button
              small
              className="!bg-neutral-800 truncate"
              icon={<Github height={16} width={16} fill={"#fff"} />}
            >
              spoty-stalk
            </Button>
          </Link> and consider contributing </p>
          <div className="flex justify-between items-start">
            <h3 className="text-xl mb-2 font-bold">Can i use this with my music?</h3>
          </div>
          <p className="text-base">This page no! But you can selfhost <Link
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USER as string
              }/${process.env.NEXT_PUBLIC_GITHUB_REPO}`}
          >
            <Button
              small
              className="!bg-neutral-800 truncate"
              icon={<Github height={16} width={16} fill={"#fff"} />}
            >
              spoty-stalk
            </Button>
          </Link> and host this app for whoever you want. </p>
          {/* <FormGroup
            label="Hide timestamp row (cleaner ui)"
          >
            <Switch
              defaultChecked={hideTimestamp}
              className="!m-0 p-0 flex items-center"
              onChange={() => dispatch(setHideTimestamp(!hideTimestamp))}

            ></Switch>
          </FormGroup> */}

        </div>
      }
    >
      <Button minimal icon="info-sign" />
    </Popover2>
  );
}

export default Info;
