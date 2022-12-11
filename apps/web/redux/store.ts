import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { settingSlice } from "./settingSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [settingSlice.name]: settingSlice.reducer,
    },
    devTools: true,
  });

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
