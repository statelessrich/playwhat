import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "pages/home/gamesSlice";
import gameDetailsReducer from "pages/game-detail/gameDetailsSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    gameDetails: gameDetailsReducer,
  },
});
