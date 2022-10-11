import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "pages/home/gamesSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
  },
});
