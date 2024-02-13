import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define a type for the slice state
interface IGameState {
  gameState: {
    timeElapsed: number;
    isRising?: boolean;
    GameID: number;
    crashTimeElapsed: number;
  };
}

// Define the initial state using that type
const initialState: IGameState = {
  gameState: {
    timeElapsed: 0,
    isRising: true,
    GameID: 0,
    crashTimeElapsed: 120,
  },
};

export const gameStateSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setGameState: (state, action) => {
      state.gameState = action.payload.gameState;
    },
  },
});

export const { setGameState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
