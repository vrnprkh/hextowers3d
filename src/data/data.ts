export interface LevelData {
  size: number;
  hexes: {
    height: number;
    at: number[];
  }[];
  numRange: number;
}
export const levels: LevelData[] = [
  {
    size: 2,
    hexes: [
      { height: 1, at: [0, 0, 0] },
      { height: 2, at: [0, -1, 1] },
      { height: 0, at: [0, 1, -1] },
      { height: 0, at: [1, -1, 0] },
      { height: 0, at: [1, 0, -1] },
      { height: 0, at: [-1, 0, 1] },
      { height: 0, at: [-1, 1, 0] },
    ],
    numRange: 4,
  },
  {
    size: 2,
    hexes: [
      { height: 0, at: [-1, 0, 1] },
      { height: 1, at: [-1, 1, 0] },
      { height: 3, at: [0, -1, 1] },
      { height: 0, at: [0, 0, 0] },
      { height: 4, at: [0, 1, -1] },
      { height: 2, at: [1, -1, 0] },
      { height: 0, at: [1, 0, -1] },
    ],
    numRange: 4,
  },
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

const defaultLevels: LevelData[] = [
  {
    size: 2,
    hexes: [
      { height: 0, at: [-1, 0, 1] },
      { height: 1, at: [-1, 1, 0] },
      { height: 3, at: [0, -1, 1] },
      { height: 0, at: [0, 0, 0] },
      { height: 4, at: [0, 1, -1] },
      { height: 2, at: [1, -1, 0] },
      { height: 0, at: [1, 0, -1] },
    ],
    numRange: 4,
  },
];

// data loader
export async function getManifest() {
  const res = await fetch("/levelData/manifest.json");
  if (!res.ok) throw new Error("Failed to load manifest");
  return res.json();
}

export async function getAvailableEdgeSizes() {
  const manifest = await getManifest();
  return Object.keys(manifest);
}

export async function getTowersForEdgeSize(edgeSize: string) {
  const manifest = await getManifest();
  return manifest[edgeSize] || [];
}

export async function loadLevelSet(
  edgeSize: number,
  towerSize: number
): Promise<LevelData[]> {
  const url = `levelData/edgeSize${edgeSize}/towersCombined${towerSize}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const data: LevelData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading level data:", error);
    return defaultLevels;
  }
}
