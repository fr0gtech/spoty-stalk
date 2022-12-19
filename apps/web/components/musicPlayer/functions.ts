import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLastSong,
  selectLoadedSongs,
  selectShuffle,
  selectSongToPlay,
  setLastSongs,
  setSongToPlay,
} from "../../redux/playerSlice";

export const useMusicControls = () => {
  const dispatch = useDispatch();
  const shuffle = useSelector(selectShuffle);
  const loadedSongsMapped = useSelector(selectLoadedSongs);
  const songToPlay = useSelector(selectSongToPlay);
  const lastSongs = useSelector(selectLastSong);

  const nextShuffle = useCallback(() => {
    if (shuffle) {
      const newSong =
        loadedSongsMapped[Math.floor(Math.random() * loadedSongsMapped.length)];
      dispatch(setSongToPlay(newSong));
      return;
    }
  }, [dispatch, loadedSongsMapped, shuffle]);

  const prevSong = useCallback(() => {
    if (shuffle) {
      nextShuffle();
      return;
    }
    const prev = loadedSongsMapped[loadedSongsMapped.indexOf(songToPlay) - 1];
    prev
      ? dispatch(setSongToPlay(prev))
      : dispatch(
          setSongToPlay(loadedSongsMapped[loadedSongsMapped.length - 1])
        );
  }, [dispatch, loadedSongsMapped, nextShuffle, shuffle, songToPlay]);

  const nextSong = useCallback(() => {
    if (shuffle) {
      nextShuffle();
      return;
    }

    const next = loadedSongsMapped[loadedSongsMapped.indexOf(songToPlay) + 1];

    next
      ? dispatch(setSongToPlay(next))
      : dispatch(setSongToPlay(loadedSongsMapped[0]));
  }, [shuffle, loadedSongsMapped, songToPlay, dispatch, nextShuffle]);

  return { nextSong, prevSong };
};
