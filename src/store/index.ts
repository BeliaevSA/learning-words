import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "./wordSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    words: wordReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
