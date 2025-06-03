import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAvailableEdgeSizes,
  getManifest,
  loadLevelSet,
  type LevelData,
} from "../data/data";
import type { RootState } from "../app/store";
import { load } from "./levelSlice";
export interface UIState {
  sidebarVisible: boolean;
  currentLevelIndex: number;
  currentSize: number;
  currentTowers: number;
  availibleSizes: number[];
  availibleTowers: number[]; // depends on sizes^
}

const initialState: UIState = {
  sidebarVisible: true,
  currentLevelIndex: 0,
  currentSize: 2,
  currentTowers: 4,
  availibleSizes: [],
  availibleTowers: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    nextLevel: (state) => {
      state.currentLevelIndex += 1;
    },
    prevLevel: (state) => {
      if (state.currentLevelIndex > 0) {
        state.currentLevelIndex--;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadEdgeSizeInfo.fulfilled, (state, action) => {
      state.availibleSizes = action.payload;
      state.currentSize = action.payload[0];
    });
  },
});

export default uiSlice.reducer;

export const selectCurrentLevelIndex = (state: RootState) =>
  state.ui.currentLevelIndex;
// thunks

// data loading
export const loadEdgeSizeInfo = createAsyncThunk("ui/loadSizes", async () => {
  const data = await getAvailableEdgeSizes();
  return data.map((e) => parseInt(e.slice(-1)));
});
export const loadTowerInfo = createAsyncThunk(
  "ui/loadTowers",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const manifest = await getManifest();
    const key = `edgeSize${state.ui.currentSize}`;
    return manifest[key] || [];
  }
);

// level management
export const goToNextLevel = createAsyncThunk(
  "ui/goToNextLevel",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentIndex = state.ui.currentLevelIndex;

    const selectedSize = state.ui.currentSize;
    const selectedTower = state.ui.currentTowers;
    const levelSet = await loadLevelSet(selectedSize, selectedTower);

    if (currentIndex < levelSet.length - 1) {
      dispatch(uiSlice.actions.nextLevel());
      dispatch(load(levelSet[currentIndex + 1]));
    }
  }
);

export const goToPreviousLevel = createAsyncThunk(
  "ui/goToPrevLevel",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentIndex = state.ui.currentLevelIndex;

    const selectedSize = state.ui.currentSize;
    const selectedTower = state.ui.currentTowers;
    const levelSet = await loadLevelSet(selectedSize, selectedTower);

    if (currentIndex > 0) {
      dispatch(uiSlice.actions.prevLevel());
      dispatch(load(levelSet[currentIndex - 1]));
    }
  }
);

export const startGame = createAsyncThunk(
  "ui/startGame",
  async (_, { dispatch, getState }) => {
    const edgeSizeResult = await dispatch(loadEdgeSizeInfo());
    const sizes = edgeSizeResult.payload as number[];
    const selectedSize = sizes[0];

    // Step 2: Load available towers for that edge size
    const towerResult = await dispatch(loadTowerInfo());
    const towers = towerResult.payload as number[];
    const selectedTower = towers[0];

    const levelsData = await loadLevelSet(selectedSize, selectedTower);

    dispatch(load(levelsData[0]));
  }
);
