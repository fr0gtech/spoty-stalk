import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { subDays } from "date-fns";
import { getCookie } from "cookies-next";

// Type for our state
export interface SettingState {
  showSpotify: boolean;
  showSoundCloud: boolean;
  showDiscoverWeekly: boolean;
  openInApp: boolean;
  lastVisit: any;
  toPlay: any | null;
  songPlaying: any;
  loadedSongs: any;
  spotifySongs: any;
  player: string;
  songDetails: any;
  playerReady: boolean;
}

// Initial state
const initialState: SettingState = {
  showSpotify: true,
  showSoundCloud: true,
  showDiscoverWeekly: false,
  openInApp: true,
  lastVisit: [], // arry of object of pages to track
  toPlay: null,
  songPlaying: null,
  loadedSongs: [],
  spotifySongs: [],
  player: "",
  songDetails: null,
  playerReady: false,
};

// Actual Slice
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setPlayerReady(state, action) {
      state.playerReady = action.payload;
    },
    setSongDetails(state, action) {
      state.songDetails = action.payload;
    },
    setSongPlaying(state, action) {
      state.songPlaying = action.payload;
    },
    setPlayer(state, action) {
      state.player = action.payload;
    },
    setSpotifySongs(state, action) {
      state.spotifySongs = action.payload;
    },
    setLoadedSongs(state, action) {
      state.loadedSongs = action.payload;
    },
    setToPlay(state, action) {
      state.toPlay = action.payload;
    },
    setLastVisit(state, action) {
      state.lastVisit = [...state.lastVisit, action.payload];
    },
    setShowSpotify(state, action) {
      state.showSpotify = action.payload;
    },
    setShowSoundCloud(state, action) {
      state.showSoundCloud = action.payload;
    },
    setShowDiscoverWeekly(state, action) {
      state.showDiscoverWeekly = action.payload;
    },
    setOpenInApp(state, action) {
      state.openInApp = action.payload;
    },
  },
});

export const {
  setPlayerReady,
  setSongDetails,
  setSongPlaying,
  setPlayer,
  setSpotifySongs,
  setLoadedSongs,
  setToPlay,
  setLastVisit,
  setShowSpotify,
  setShowSoundCloud,
  setShowDiscoverWeekly,
  setOpenInApp,
} = settingSlice.actions;

export const selectShowSpotify = (state: AppState) => state.setting.showSpotify;
export const selectShowSoundCloud = (state: AppState) =>
  state.setting.showSoundCloud;
export const selectShowDiscoverWeekly = (state: AppState) =>
  state.setting.showDiscoverWeekly;
export const selectOpenInApp = (state: AppState) => state.setting.openInApp;
export const selectLastVisit = (state: AppState) => state.setting.lastVisit;
export const selectToPlay = (state: AppState) => state.setting.toPlay;
export const selectLoadedSongs = (state: AppState) => state.setting.loadedSongs;
export const selectSpotifySongs = (state: AppState) =>
  state.setting.spotifySongs;
export const selectPlayer = (state: AppState) => state.setting.player;
export const selectSongPlaying = (state: AppState) => state.setting.songPlaying;
export const selectSongDetails = (state: AppState) => state.setting.songDetails;
export const selectPlayerReady = (state: AppState) => state.setting.playerReady;

export default settingSlice.reducer;
