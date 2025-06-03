import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LevelData } from "../data/data";
import { modulo } from "../util/hexagonUtils";
import type { RootState } from "../app/store";
type tileMap = {
  [key: string]: {
    q: number;
    r: number;
    sees: number;
    target: number;
    height: number;
    indicator: boolean;
    hovered: boolean;
  };
};

export interface LevelState {
  size: number;
  indexes: [number, number][];
  tiles: tileMap;
  numRange: number;
  hovered: string[];
}
const initialState: LevelState = {
  size: 0,
  indexes: [],
  tiles: {},
  numRange: 0,
  hovered: [],
};

const offsets = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

function computeSeen(q: number, r: number, levelState: LevelState) {
  const startHeight = levelState.tiles[`${q}-${r}`].height;
  let seen = 0;

  offsets.forEach((offset) => {
    let qn = q + offset[0];
    let rn = r + offset[1];

    while (`${qn}-${rn}` in levelState.tiles) {
      if (levelState.tiles[`${qn}-${rn}`].height > startHeight) {
        seen += 1;
        return;
      }
      qn += offset[0];
      rn += offset[1];
    }
  });
  return seen;
}

// helpers
function applyReset(state: LevelState) {
  state.indexes.forEach((element) => {
    state.tiles[`${element[0]}-${element[1]}`].height = 0;
  });
}

function applySeesUpdates(state: LevelState) {
  state.indexes.forEach((element) => {
    const q = element[0];
    const r = element[1];
    const index = `${q}-${r}`;
    if (state.tiles[index].height == 0) {
      return;
    }
    state.tiles[index].sees = computeSeen(q, r, state);
  });
}
function applyHighlightUpdates(state: LevelState) {
  // clear
  state.indexes.forEach((index) => {
    state.tiles[`${index[0]}-${index[1]}`].indicator = false;
    state.tiles[`${index[0]}-${index[1]}`].hovered = false;
  });

  state.hovered.forEach((index) => {
    state.tiles[index].hovered = true;

    if (state.tiles[index].height == 0) {
      return;
    }
    const q = state.tiles[index].q;
    const r = state.tiles[index].r;
    const startHeight = state.tiles[index].height;
    offsets.forEach((offset) => {
      let qn = q + offset[0];
      let rn = r + offset[1];

      while (`${qn}-${rn}` in state.tiles) {
        if (state.tiles[`${qn}-${rn}`].height > startHeight) {
          state.tiles[`${qn}-${rn}`].indicator = true;
          return;
        }
        qn += offset[0];
        rn += offset[1];
      }
    });
  });
}

export const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {
    load: (state, action: PayloadAction<LevelData>) => {
      // clear tiles
      state.tiles = {};

      state.size = action.payload.size;
      state.numRange = action.payload.numRange;

      // populate
      action.payload.hexes.forEach((hex) => {
        state.tiles[`${hex.at[0]}-${hex.at[1]}`] = {
          q: hex.at[0],
          r: hex.at[1],
          sees: 0,
          target: 0,
          height: hex.height,
          indicator: false,
          hovered: false,
        };
        state.indexes.push([hex.at[0], hex.at[1]]);
      });

      // initialize targets
      state.indexes.forEach((element) => {
        const q = element[0];
        const r = element[1];
        const index = `${q}-${r}`;
        if (state.tiles[index].height == 0) {
          state.tiles[index].target = -1;
          return;
        }
        state.tiles[index].target = computeSeen(q, r, state);
      });
      // reset heights

      applyReset(state);
    },
    reset: (state) => {
      applyReset(state);
    },
    incrementHeight: (state, action: PayloadAction<string>) => {
      // takes in a index
      state.tiles[action.payload].height =
        (state.tiles[action.payload].height + 1) % (state.numRange + 1);
      applySeesUpdates(state);
      applyHighlightUpdates(state);
    },
    decrementHeight: (state, action: PayloadAction<string>) => {
      // takes in a index
      state.tiles[action.payload].height = modulo(
        state.tiles[action.payload].height - 1,
        state.numRange + 1
      );
      applySeesUpdates(state);
      applyHighlightUpdates(state);
    },

    addHover: (state, action: PayloadAction<string>) => {
      if (!state.hovered.includes(action.payload)) {
        state.hovered.push(action.payload);
      }
      applyHighlightUpdates(state);
    },
    removeHover: (state, action: PayloadAction<string>) => {
      if (state.hovered.includes(action.payload)) {
        state.hovered = state.hovered.filter((e) => e !== action.payload);
      }
      applyHighlightUpdates(state);
    },
  },
});

export const {
  load,
  reset,
  incrementHeight,
  decrementHeight,
  addHover,
  removeHover,
} = levelSlice.actions;

export default levelSlice.reducer;

export const selectIndexes = (state: RootState) => state.level.indexes;
export const selectTiles = (state: RootState) => state.level.tiles;
export const selectTile = (stringId: string) => (state: RootState) =>
  state.level.tiles[stringId];
