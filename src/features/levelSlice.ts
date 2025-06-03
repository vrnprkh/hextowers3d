import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LevelData } from "../data/data";
import { element } from "three/tsl";

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
	indexes : string[]
  tiles: tileMap;
  numRange: number;
}
const initialState: LevelState = {
  size: 0,
	indexes : [],
  tiles: {},
  numRange: 0,
};

export const LevelSlice = createSlice({
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
				state.indexes.push(`${hex.at[0]}-${hex.at[1]}`);
      });
			
			// initialize
			state.indexes.forEach((index) => {
				
			})
			
    },
  },
});
