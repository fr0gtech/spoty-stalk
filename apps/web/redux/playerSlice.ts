import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

// Type for our state
export interface PlayerState {
  play: boolean;
  next: boolean;
  prev: boolean;
  playSetter: boolean;

  shuffle: boolean;
  volume: number;
  lastVolume: number;

  progressMS: number;
  durationMS: number;
  seekTo: number | null;
  isSeeking: boolean;

  songInfo: {
    song: { title: string; image: string; uri: string };
    artists: [{ name: string; uri: string }];
  };
  songToPlay: string;
  loadedSongs: Array<string>;
  ready: boolean;
  type: string | null;
  playerInstance: any;
}

// Initial state
const initialState: PlayerState = {
  play: false,
  next: false,
  prev: false,
  playSetter: false,

  shuffle: false,
  volume: 0,
  lastVolume: 0,

  progressMS: 0,
  durationMS: 0,
  seekTo: null,
  isSeeking: false,

  songInfo: {
    song: { title: "", image: "", uri: "" },
    artists: [{ name: "", uri: "" }],
  },
  songToPlay: "",
  loadedSongs: [],
  ready: false,
  type: null,
  playerInstance: null,
};

// Actual Slice
export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlay(state, action) {
      state.play = action.payload;
    },
    setNext(state, action) {
      state.next = action.payload;
    },
    setPrev(state, action) {
      state.prev = action.payload;
    },
    setPlaySetter(state, action) {
      state.playSetter = action.payload;
    },
    setShuffle(state, action) {
      state.shuffle = action.payload;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
    setLastVolume(state, action) {
      state.lastVolume = action.payload;
    },
    setProgressMS(state, action) {
      state.progressMS = action.payload;
    },
    setDurationMS(state, action) {
      state.durationMS = action.payload;
    },
    setSeekTo(state, action) {
      state.seekTo = action.payload;
    },
    setIsSeeking(state, action) {
      state.isSeeking = action.payload;
    },
    setSongInfo(state, action) {
      state.songInfo = action.payload;
    },
    setSongToPlay(state, action) {
      state.songToPlay = action.payload;
    },
    setLoadedSongs(state, action) {
      state.loadedSongs = action.payload;
    },
    setReady(state, action) {
      state.ready = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
    },
    setPlayerInstance(state, action) {
      state.playerInstance = action.payload;
    },
  },
});

export const {
  setPlay,
  setNext,
  setPrev,
  setPlaySetter,
  setShuffle,
  setVolume,
  setSongToPlay,
  setLastVolume,
  setProgressMS,
  setDurationMS,
  setSeekTo,
  setLoadedSongs,
  setIsSeeking,
  setSongInfo,
  setReady,
  setType,
  setPlayerInstance,
} = playerSlice.actions;

export const selectPlaySetter = (state: AppState) => state.player.playSetter;
export const selectPlay = (state: AppState) => state.player.play;
export const selectNext = (state: AppState) => state.player.next;
export const selectPrev = (state: AppState) => state.player.prev;
export const selectShuffle = (state: AppState) => state.player.shuffle;
export const selectVolume = (state: AppState) => state.player.volume;
export const selectSongToPlay = (state: AppState) => state.player.songToPlay;
export const selectLastVolume = (state: AppState) => state.player.lastVolume;
export const selectProgressMS = (state: AppState) => state.player.progressMS;
export const selectDurationMS = (state: AppState) => state.player.durationMS;
export const selectSeekTo = (state: AppState) => state.player.seekTo;
export const selectSongInfo = (state: AppState) => state.player.songInfo;
export const selectType = (state: AppState) => state.player.type;
export const selectReady = (state: AppState) => state.player.ready;
export const selectLoadedSongs = (state: AppState) => state.player.loadedSongs;

export const selectPlayerInstance = (state: AppState) =>
  state.player.playerInstance;

export default playerSlice.reducer;
