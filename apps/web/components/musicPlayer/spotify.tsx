import sl from 'date-fns/esm/locale/sl/index.js';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoadedSongs, selectPlay, selectPlayerInstance, selectPlaySetter, selectProgressMS, selectSeekTo, selectShuffle, selectSongToPlay, selectType, selectVolume, setDurationMS, setNext, setPlay, setPlayerInstance, setProgressMS, setReady, setSongInfo, setSongToPlay, setType } from '../../redux/playerSlice';
import { Toast } from '../toaster';
import { useMusicControls } from './functions';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function SpotifyPlayer(props: { token: string; }) {
    const dispatch = useDispatch()
    const [player, setPlayer] = useState<any>()
    const [device_id, setDevice] = useState<any>(undefined);
    const toPlay = useSelector(selectSongToPlay)
    const volume = useSelector(selectVolume)
    const isPlaying = useSelector(selectPlay)
    const playerType = useSelector(selectType)
    const progressMS = useSelector(selectProgressMS)
    const seekTo = useSelector(selectSeekTo)

    const play = useCallback(() => {
        player._options.getOAuthToken((access_token: any) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [`spotify:track:${toPlay}`,] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            }).then((response) => {
                if (response.ok) {
                    dispatch(setPlay(true))
                }
                if (response.status === 502) {
                    Toast?.show({ message: `Song could not be played: ${response.status} Spotify Play error: ${response.statusText}`, intent: 'warning' })
                    dispatch(setNext(true))
                }
                if (response.status === 404) play()

            })

        });
    }, [device_id, dispatch, player, toPlay])

    const setplay = useCallback(() => {
        play();
    }, [play])

    const setPause = useCallback(async () => {
        if (player) await player.pause()
    }, [player])

    useEffect(() => {
        if (player && toPlay && !toPlay.includes("soundcloud")) {
            setplay()
            dispatch(setType('spotify'))
        } else {
            setPause()
        }
    }, [dispatch, play, player, setPause, setplay, toPlay])

    useEffect(() => {
        const tplay = async () => {
            if (playerType !== "spotify") return
            if (isPlaying) {
                await player.resume()
            } else {
                await player.pause()
            }
        }
        if (player) tplay()
    }, [isPlaying, player, playerType])

    // player seek to
    useEffect(() => {
        if (!player) return
        if (seekTo) {
            player.seek(seekTo)
        }
    }, [player, seekTo]);

    useEffect(() => {
        if (!player) return
        const timeout = setTimeout(() => {
            player.getCurrentState().then((state: any) => {
                if (!state) return
                dispatch(setProgressMS(state.position))                
                if (state.position > state.duration - 1000) dispatch(setNext(true)) // bad hack for next song
            })
        }, 1000);
        return () => clearTimeout(timeout)
    }, [dispatch, isPlaying , player, progressMS])

    const setVol = useCallback(async () => {
        await player.setVolume(volume)
    }, [player, volume])

    useEffect(() => {
        if (player) setVol()
    }, [player, setVol, volume])

    
    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const spotifyPlayer = new window.Spotify.Player({
                name: 'Web Playback SDK!!!',
                getOAuthToken: cb => { cb(props.token); },
                volume: volume
            });

            setPlayer(spotifyPlayer)

            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                dispatch(setReady(true))
                setDevice(device_id)
            });

            spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                dispatch(setReady(false))

            });

            spotifyPlayer.addListener('player_state_changed', (state => {
                if (!state) return
                
                if (state.track_window.current_track === null) return
        
                dispatch(setDurationMS(state.track_window.current_track.duration_ms))
                dispatch(setSongInfo({
                    song: { title: state.track_window.current_track.name, image: state.track_window.current_track.album.images[1].url, uri: state.track_window.current_track.uri },
                    artists: state.track_window.current_track.artists
                }))               
               
            }));

            spotifyPlayer.connect();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            if (player) player.disconnect()
            setReady(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <></>
    );
}

export default SpotifyPlayer