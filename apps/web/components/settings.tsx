import { Button, Checkbox, FormGroup, Icon, InputGroup, Slider, Switch } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useDispatch, useSelector } from "react-redux";
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
import { selectOpenInApp, selectShowDiscoverWeekly, selectShowSoundCloud, selectShowSpotify, setOpenInApp, setShowDiscoverWeekly, setShowSoundCloud, setShowSpotify } from "../redux/settingSlice";
import { useQueryClient } from "@tanstack/react-query";
import Github from '../public/github.svg'
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
function Settings(){
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { data: session, status }: any = useSession();

  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly)
  const openInapp = useSelector(selectOpenInApp)
  const showSpotify = useSelector(selectShowSpotify)
  const showSoundclud = useSelector(selectShowSoundCloud)
    return (
        <Popover2
        minimal
        content={
            <div className="p-3 bg-neutral-800">
              <div className="flex justify-between items-start">
              <h3 className="text-xl mb-2">Settings</h3>
              {session && (
          <Button
                title="Log Out"
            minimal
            intent="danger"
            icon="log-out"
            onClick={() => signOut()}
          />
        )}
              </div>
              <FormGroup
              label="Sources"
              >
              <Checkbox checked={showSpotify} label="Spotify" onChange={()=>{
                queryClient.removeQueries({ queryKey: ['songs'], type: 'active' })
                dispatch(setShowSpotify(!showSpotify))
                }} />
              <Checkbox checked={showSoundclud} label="Soundcloud" onChange={()=>{
                queryClient.removeQueries({ queryKey: ['songs'], type: 'active' })
                dispatch(setShowSoundCloud(!showSoundclud))
                }} />

              </FormGroup>
              <FormGroup
              label="Hide Discover Weekly"
              helperText={!showDiscoverWeekly?"Hiding songs from Discover Weekly" : "Showing songs from Discover Weekly"}

              >
              <Switch
                defaultChecked={!showDiscoverWeekly}
                onChange={() =>
                  dispatch(setShowDiscoverWeekly(!showDiscoverWeekly))
                }
                labelElement={
                  <span className="m-0 p-0">
                    <Icon icon="signal-search" />
                  </span>
                }
                className="!m-0 p-0"
              ></Switch>
              </FormGroup>
              <FormGroup
              label="Open In app"
              helperText={openInapp?"We will try to open links in App" : "Links will be opened in browser"}
              >
               <Switch
               defaultChecked={openInapp}
                className="!m-0 p-0 flex items-center"
                onChange={() => dispatch(setOpenInApp(!openInapp))}
                labelElement={
                  <span className="m-0 p-0">
                    {openInapp ? (
                      <Spotify
                        fill={"#1DB954"}
                        className={
                          " inline-block -mt-[5px]"
                        }
                        height={16}
                        width={16}
                      />
                    ) : (
                      <Share
                        fill={"#ffffff"}
                        className={
                          "inline-block -mt-[5px]"
                        }
                        height={14}
                        width={16}
                      />
                    )}
                  </span>
                }
              ></Switch>
              </FormGroup>              
              <div className="flex gap-2 items-center opacity-40 hover:opacity-100 duration-150">
                <div className="text-xs truncate">do you want to contribute?</div>
                <div className="grow">
                <Link href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USER as string}/${process.env.NEXT_PUBLIC_GITHUB_REPO}`}>

              <Button className="!bg-neutral-800 truncate" icon={<Github height={16} width={16} fill={'#fff'}/>}>spoty-stalk</Button>
              </Link>

                </div>

              </div>
            </div>
        }>
            <Button minimal  icon="settings"/>
        </Popover2>
    )
}

export default Settings