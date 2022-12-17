import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

// Type for our state
export interface SettingState {
  showSpotify: boolean;
  showSoundCloud: boolean;
  showDiscoverWeekly: boolean;
  hideTimestamp: boolean;
  openInApp: boolean;
  lastVisit: any;
}

// Initial state
const initialState: SettingState = {
  showSpotify: true,
  showSoundCloud: true,
  showDiscoverWeekly: false,
  hideTimestamp: false,
  openInApp: true,
  lastVisit: [], // arry of object of pages to track
};

// Actual Slice
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setHideTimestamp(state, action) {
      state.hideTimestamp = action.payload;
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
  setHideTimestamp,
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

export const selectHideTimestamp = (state: AppState) =>
  state.setting.hideTimestamp;

export default settingSlice.reducer;
