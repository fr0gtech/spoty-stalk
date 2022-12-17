import { useCallback, useEffect, useRef, useState } from "react";
import SoundCloudPlayer from "react-player/soundcloud";
import { useDispatch, useSelector } from "react-redux";
import { selectPlay, selectSeekTo, selectSongToPlay, selectVolume, setDurationMS, setNext, setPlay, setProgressMS, setSongInfo, setType } from "../../redux/playerSlice";
import { useMusicControls } from "./functions";

function SoundCloudPlayerComp(){

    const dispatch = useDispatch()
    const scref = useRef<any>()
    const toPlay = useSelector(selectSongToPlay)
    const [urlToPlay, setUrlToPlay] = useState<any>()
    const play = useSelector(selectPlay)
    const volume = useSelector(selectVolume)
    const [is_paused, setPaused] = useState(false)
    const seekTo = useSelector(selectSeekTo)

    useEffect(()=>{
        if (!toPlay) return
        if (toPlay.includes("soundcloud")){
            setPaused(false)
            setUrlToPlay(toPlay)
            dispatch(setPlay(true))
            if (scref.current) scref.current.seekTo(0, 'seconds')
            dispatch(setType('soundcloud'))
        }else{
            setPaused(true)
        }
    },[dispatch, toPlay])

    useEffect(() => {
        if (seekTo) {
            scref.current.seekTo(seekTo / 1000, "seconds")
        }
    }, [scref,seekTo]);
    
  // get soundcloud song details
  const getSCDetails = useCallback(async () => {
    const player = scref.current.getInternalPlayer();
    player.getCurrentSound(function (sound: any) {
      if (!sound) return;
      dispatch(
        setSongInfo({
          song: {
            title: sound.title,
            image: sound.artwork_url || "",
            uri: sound.permalink_url,
          },
          artists: [
            { name: sound.user.username, uri: sound.user.permalink_url },
          ],
        })
      );
    });
  }, [dispatch]);
    return (
        <div>
            <SoundCloudPlayer
                ref={scref as any}
                onReady={(e)=>{getSCDetails();dispatch(setDurationMS(e.getDuration() * 1000))}}
                onProgress={(state)=>dispatch(setProgressMS(state.playedSeconds * 1000))}
                onEnded={()=>dispatch(setNext(true))}
                volume={volume}
                autoPlay={play}
                playing={play && !is_paused}
                url={urlToPlay}/>
        </div>
    )
}

export default SoundCloudPlayerComp