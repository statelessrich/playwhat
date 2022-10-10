import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  status: "idle",
};

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    updateGames: (state, action) => {
      state.value = action.payload;
    },
    createGame: (state, action) => {
      state.value.unshift(action.payload);
    },
    deleteGames: (state) => {
      state.value = [];
    },
  },
});

// export actions
export const { updateGames, createGame, deleteGames } = gamesSlice.actions;

// export selectors
export const selectGames = (state) => state.games.value;

export default gamesSlice.reducer;
