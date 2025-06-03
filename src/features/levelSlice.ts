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
  };
};

export interface LevelState {
  size: number;
  indexes: [number, number][];
  tiles: tileMap;
  numRange: number;
}
const initialState: LevelState = {
  size: 0,
  indexes: [],
  tiles: {},
  numRange: 0,
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
      levelSlice.caseReducers.reset(state);
    },
    reset: (state) => {
      state.indexes.forEach((element) => {
        state.tiles[`${element[0]}-${element[1]}`].height = 0;
      });
    },
    incrementHeight: (state, action: PayloadAction<string>) => {
      // takes in a index
      state.tiles[action.payload].height =
        (state.tiles[action.payload].height + 1) % (state.numRange + 1);
    },
    decrementHeight: (state, action: PayloadAction<string>) => {
      // takes in a index
      state.tiles[action.payload].height = modulo(
        state.tiles[action.payload].height - 1,
        state.numRange + 1
      );
    },
  },
});

export const { load, reset, incrementHeight, decrementHeight } =
  levelSlice.actions;

export default levelSlice.reducer;

export const selectIndexes = (state: RootState) => state.level.indexes;
export const selectTiles = (state: RootState) => state.level.tiles;
export const selectTile = (stringId : string) => (state : RootState) => state.level.tiles[stringId];