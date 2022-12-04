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
}

// Initial state
const initialState: SettingState = {
  showSpotify: true,
  showSoundCloud: true,
  showDiscoverWeekly: false,
  openInApp: true,
  lastVisit: getCookie("left") || new Date(),
};

// Actual Slice
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setLastVisit(state, action) {
      state.lastVisit = action.payload;
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

export const {setLastVisit, setShowSpotify, setShowSoundCloud, setShowDiscoverWeekly, setOpenInApp } = settingSlice.actions;

export const selectShowSpotify = (state: AppState) => state.setting.showSpotify;
export const selectShowSoundCloud = (state: AppState) => state.setting.showSoundCloud;
export const selectShowDiscoverWeekly = (state: AppState) => state.setting.showDiscoverWeekly;
export const selectOpenInApp = (state: AppState) => state.setting.openInApp;
export const selectLastVisit = (state: AppState) => state.setting.lastVisit;

export default settingSlice.reducer;