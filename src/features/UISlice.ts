import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getAvailableEdgeSizes, getManifest, loadLevelSet } from "../data/data";
import type { RootState } from "../app/store";
import { load } from "./levelSlice";
export interface UIState {
  sidebarVisible: boolean;
  currentLevelIndex: number;
  currentSize: number;
  currentTowers: number;

  availibleSizes: number[];
  availibleTowers: number[]; // depends on sizes^
  totalLevelCount: number;
}

const initialState: UIState = {
  sidebarVisible: true,
  currentLevelIndex: 0,
  currentSize: 2,
  currentTowers: 4,
  availibleSizes: [],
  availibleTowers: [],
  totalLevelCount: 0,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.sidebarVisible = !state.sidebarVisible;
    },
    nextLevel: (state) => {
      state.currentLevelIndex += 1;
    },
    prevLevel: (state) => {
      if (state.currentLevelIndex > 0) {
        state.currentLevelIndex--;
      }
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.currentLevelIndex = action.payload;
    },
    resetLevel: (state) => {
      state.currentLevelIndex = 0;
    },
    setCurrentEdgeSize: (state, action: PayloadAction<number>) => {
      state.currentSize = action.payload;
    },
    setCurrentTowers: (state, action: PayloadAction<number>) => {
      state.currentTowers = action.payload;
    },
    setTotalLevelCount: (state, action: PayloadAction<number>) => {
      state.totalLevelCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEdgeSizeInfo.fulfilled, (state, action) => {
        state.availibleSizes = action.payload;
        state.currentSize = action.payload[0];
      })
      .addCase(loadTowerInfo.fulfilled, (state, action) => {
        state.availibleTowers = action.payload;
        state.currentTowers = action.payload[0];
      });
  },
});

export default uiSlice.reducer;

export const { toggleSideBar } = uiSlice.actions;
// selectors
const selectUI = (state: RootState) => state.ui;

export const selectSidebarUIInfo = createSelector(
  [selectUI],
  (ui) => ({
    currentLevel: ui.currentLevelIndex,
    currentEdge: ui.currentSize,
    currentTower: ui.currentTowers,
    currentEdgeOptions: ui.availibleSizes,
    currentTowerOptions: ui.availibleTowers,
    levelCount: ui.totalLevelCount,
    sidebarVisible: ui.sidebarVisible,
  })
);



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

export const goToLevel = createAsyncThunk(
  "ui/goToPrevLevel",
  async (levelNum: number, { dispatch, getState }) => {
    const state = getState() as RootState;

    const selectedSize = state.ui.currentSize;
    const selectedTower = state.ui.currentTowers;
    const levelSet = await loadLevelSet(selectedSize, selectedTower);

    dispatch(uiSlice.actions.setLevel(levelNum));
    dispatch(load(levelSet[levelNum]));
  }
);

export const startGame = createAsyncThunk(
  "ui/startGame",
  async (_, { dispatch }) => {
    const edgeSizeResult = await dispatch(loadEdgeSizeInfo());
    const sizes = edgeSizeResult.payload as number[];
    const selectedSize = sizes[0];

    const towerResult = await dispatch(loadTowerInfo());
    const towers = towerResult.payload as number[];
    const selectedTower = towers[0];

    const levelsData = await loadLevelSet(selectedSize, selectedTower);
    // update level count
    dispatch(uiSlice.actions.setTotalLevelCount(levelsData.length));

    dispatch(load(levelsData[0]));
  }
);

export const changeEdgeSize = createAsyncThunk(
  "ui/changeEdgeSize",
  async (newEdgeSize: number, { dispatch, getState }) => {
    // set new edge size
    dispatch(uiSlice.actions.resetLevel());
    dispatch(uiSlice.actions.setCurrentEdgeSize(newEdgeSize));

    // laod tower info using size from state
    const towerResult = await dispatch(loadTowerInfo());
    const towers = towerResult.payload as number[];
    const selectedTower = towers[0];

    // load new size
    const state = getState() as RootState;
    const currentSize = state.ui.currentSize;

    const levelsData = await loadLevelSet(currentSize, selectedTower);
    dispatch(uiSlice.actions.setTotalLevelCount(levelsData.length));
    dispatch(load(levelsData[0]));
  }
);

export const changeCurrentTowers = createAsyncThunk(
  "ui/changeTowers",
  async (newTowerSize: number, { dispatch, getState }) => {
    // set new edge size
    dispatch(uiSlice.actions.resetLevel());
    dispatch(uiSlice.actions.setCurrentTowers(newTowerSize));
    // load new size
    const state = getState() as RootState;
    const currentSize = state.ui.currentSize;

    const levelsData = await loadLevelSet(currentSize, newTowerSize);
    dispatch(uiSlice.actions.setTotalLevelCount(levelsData.length));
    dispatch(load(levelsData[0]));
  }
);
