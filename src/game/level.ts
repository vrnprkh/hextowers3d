import type { LevelData } from "../data/data";

export class Axial {
  q: number;
  r: number;
  constructor(q: number, r: number) {
    this.q = q;
    this.r = r;
  }
  add(other: Axial): Axial {
    return new Axial(this.q + other.q, this.r + other.r);
  }
}

export class HexCellData {
  coordinate: Axial;
  sees: number;
	target : number;
  height: number;
  constructor(coordinate: Axial, sees: number = 0, target: number = 0, height: number = 0) {
    this.coordinate = coordinate;
    this.sees = sees;
		this.target = target;
    this.height = height;
  }
}


const axialOffsets: Axial[] = [
  new Axial(1, 0),
  new Axial(1, -1),
  new Axial(0, -1),
  new Axial(-1, 0),
  new Axial(-1, 1),
  new Axial(0, 1),
];

export class LevelState {
  // Axial should match with Axial in hexData
  tiles: Map<Axial, HexCellData>;
  size: number;
  numRange: number;
  constructor() {
		// just call load after
    this.tiles = new Map();
		this.size = 0;
    this.numRange = 0;
  }

	load(levelData : LevelData) {
		this.tiles = new Map();
    levelData.hexes.forEach((hex) => {
      const coord = new Axial(hex.at[0], hex.at[1]);
      this.tiles.set(coord, new HexCellData(coord, 0, hex.height));
    });
    this.size = levelData.size;
    this.numRange = levelData.numRange;

		// populate target see values
    this.tiles.forEach((v, k) => {
			v.target = this.getSeen(k);
		})
	}

  getSeen(coordinate: Axial) {
    let seen = 0;
		const tile = this.tiles.get(coordinate);
		if (!tile) {
			return 0;
		}
    const startHeight = tile.height;
    axialOffsets.forEach((offset) => {
      let currentCoord = new Axial(coordinate.q, coordinate.r);
      currentCoord.add(offset);
			let tile : HexCellData | undefined;
			while (tile = this.tiles.get(currentCoord)) {
				if (tile.height > startHeight) {
					seen += 1;
					return;
				}
				currentCoord = currentCoord.add(offset);
			}
    });
		return seen;
  }

	reset() {
		this.tiles.forEach((v) => {
			v.height = 0;
		})
	}
}
