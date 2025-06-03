import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { levels } from "../data/data";
import type { RootState } from "../app/store";
import { load } from "./levelSlice";
export interface UIState {
  sidebarVisible: boolean;
  currentLevelIndex: number;
	currentSize : number;
	currentTowers : number;
}

const initialState: UIState = {
  sidebarVisible: true,
  currentLevelIndex: 0,
	currentSize : 2,
	currentTowers : 4,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    nextLevel: (state) => {
      if (state.currentLevelIndex < levels.length - 1) {
        state.currentLevelIndex += 1;
      }
    },
    prevLevel: (state) => {
      if (state.currentLevelIndex > 0) {
        state.currentLevelIndex--;
      }
    },
  },
});

export default uiSlice.reducer;

export const selectCurrentLevelIndex = (state: RootState) =>
  state.ui.currentLevelIndex;
// thunks

export const goToNextLevel = createAsyncThunk(
  "ui/goToNextLevel",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentIndex = state.ui.currentLevelIndex;

    if (currentIndex < levels.length - 1) {
      dispatch(uiSlice.actions.nextLevel());
      dispatch(load(levels[currentIndex + 1]));
    }
  }
);

export const goToPreviousLevel = createAsyncThunk(
  "ui/goToPrevLevel",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentIndex = state.ui.currentLevelIndex;

    if (currentIndex > 0) {
      dispatch(uiSlice.actions.prevLevel());
      dispatch(load(levels[currentIndex - 1]));
    }
  }
);

export const startGame = createAsyncThunk(
  "ui/startGame",
  async (_, { dispatch }) => {
    dispatch(load(levels[0]));
  }
);
