import { Button, Checkbox, FormGroup, Icon, InputGroup, Switch } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useDispatch, useSelector } from "react-redux";
import Spotify from "../public/spotify.svg";
import Share from "../public/share.svg";
import { selectOpenInApp, selectShowDiscoverWeekly, selectShowSoundCloud, selectShowSpotify, setOpenInApp, setShowDiscoverWeekly, setShowSoundCloud, setShowSpotify } from "../redux/settingSlice";
import { useQueryClient } from "@tanstack/react-query";

function Settings(){
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const showDiscoverWeekly = useSelector(selectShowDiscoverWeekly)
  const openInapp = useSelector(selectOpenInApp)
  const showSpotify = useSelector(selectShowSpotify)
  const showSoundclud = useSelector(selectShowSoundCloud)
    return (
        <Popover2
        minimal
        content={
            <div className="p-3 bg-neutral-800">
              <h3 className="text-xl mb-2">Settings</h3>
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
              helperText={showDiscoverWeekly?"Hiding songs from Discover Weekly" : "Showing songs from Discover Weekly"}

              >
              <Switch
                defaultChecked={showDiscoverWeekly}
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
            </div>
        }>
            <Button className="!bg-neutral-800"  icon="settings"/>
        </Popover2>
    )
}

export default Settings