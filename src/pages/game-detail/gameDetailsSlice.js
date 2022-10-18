import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  status: "idle",
};

export const gameDetailsSlice = createSlice({
  name: "gameDetails",
  initialState,
  reducers: {
    updateGameDetails: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

// export actions
export const { updateGameDetails } = gameDetailsSlice.actions;

// export selectors
export const selectGameDetails = (state) => state.gameDetails.value;

export default gameDetailsSlice.reducer;
