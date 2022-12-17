import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadedSongs,
  selectShuffle,
  selectSongToPlay,
  setSongToPlay,
} from "../../redux/playerSlice";

export const useMusicControls = () => {
  const dispatch = useDispatch();
  const shuffle = useSelector(selectShuffle);
  const loadedSongsMapped = useSelector(selectLoadedSongs);
  const songToPlay = useSelector(selectSongToPlay);

  const prevSong = useCallback(() => {
    if (shuffle) {
      dispatch(
        setSongToPlay(
          loadedSongsMapped[
            Math.floor(Math.random() * loadedSongsMapped.length)
          ]
        )
      );
      return;
    }
    const prev = loadedSongsMapped[loadedSongsMapped.indexOf(songToPlay) - 1];
    prev
      ? dispatch(setSongToPlay(prev))
      : dispatch(
          setSongToPlay(loadedSongsMapped[loadedSongsMapped.length - 1])
        );
  }, [dispatch, loadedSongsMapped, shuffle, songToPlay]);

  const nextSong = useCallback(() => {
    if (shuffle) {
      dispatch(
        setSongToPlay(
          loadedSongsMapped[
            Math.floor(Math.random() * loadedSongsMapped.length)
          ]
        )
      );
      return;
    }

    const next = loadedSongsMapped[loadedSongsMapped.indexOf(songToPlay) + 1];

    next
      ? dispatch(setSongToPlay(next))
      : dispatch(setSongToPlay(loadedSongsMapped[0]));
  }, [shuffle, loadedSongsMapped, songToPlay, dispatch]);

  return { nextSong, prevSong };
};
