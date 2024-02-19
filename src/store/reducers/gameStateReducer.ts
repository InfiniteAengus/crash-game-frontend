import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { f, fixed } from '@/utils/utils';

// Define a type for the slice state
interface IGameState {
  gameState: {
    timeElapsed: number;
    isRising?: boolean;
    GameID: number;
    crashTimeElapsed: number;
  };
  player: {
    id: string;
    name: string;
    balance: number;
  };
  betAmount: number;
  histories: any[];
}

// Define the initial state using that type
const initialState: IGameState = {
  gameState: {
    timeElapsed: 0,
    isRising: true,
    GameID: 0,
    crashTimeElapsed: 120,
  },
  player: {
    id: '',
    name: '',
    balance: 1000,
  },
  betAmount: 0,
  histories: [],
};

export const gameStateSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setGameState: (state, action) => {
      const { isRising, timeElapsed } = action.payload.gameState;
      const time = Math.max(timeElapsed - 5, 0);
      if (state.gameState.isRising && !isRising) {
        state.histories = [...state.histories, { crashPoint: fixed(f(time), 2) }];
      }
      state.gameState = action.payload.gameState;
    },
    setPlayername: (state, action: PayloadAction<string>) => {
      state.player.name = action.payload;
      state.player.id = action.payload + '-' + new Date().getTime();
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.player.balance += action.payload;
    },
    setBetAmount: (state, action: PayloadAction<number>) => {
      state.betAmount = action.payload;
    },
  },
});

export const { setGameState, setPlayername, updateBalance, setBetAmount } = gameStateSlice.actions;

export default gameStateSlice.reducer;
