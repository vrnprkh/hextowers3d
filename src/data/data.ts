export interface LevelData {
  size: number;
  hexes: {
    height: number;
    at: [number, number, number];
  }[];
  numRange: number;
}
export const levels: LevelData[] = [
  {
    size: 3,
    hexes: [
      { height: 3, at: [-2, 0, 2] },
      { height: 0, at: [-2, 1, 1] },
      { height: 4, at: [-2, 2, 0] },
      { height: 2, at: [-1, -1, 2] },
      { height: 1, at: [-1, 0, 1] },
      { height: 3, at: [-1, 1, 0] },
      { height: 0, at: [-1, 2, -1] },
      { height: 0, at: [0, -2, 2] },
      { height: 0, at: [0, -1, 1] },
      { height: 2, at: [0, 0, 0] },
      { height: 1, at: [0, 1, -1] },
      { height: 2, at: [0, 2, -2] },
      { height: 3, at: [1, -2, 1] },
      { height: 0, at: [1, -1, 0] },
      { height: 3, at: [1, 0, -1] },
      { height: 0, at: [1, 1, -2] },
      { height: 0, at: [2, -2, 0] },
      { height: 0, at: [2, -1, -1] },
      { height: 3, at: [2, 0, -2] },
    ],
    numRange: 4,
  },
];
