import Hexagon from "./Hexagon";
import { axialToPixel } from "../util/hexagonUtils";
import type { ThreeElements } from "@react-three/fiber";


// move this to game state
let heightMap = new Map<[number, number], number>();

// populate board
const rangeSize = 3 - 1;
for (let q = -rangeSize; q < rangeSize + 1; q++) {
  const r1 = Math.max(-rangeSize, -q - rangeSize);
  const r2 = Math.min(rangeSize, -q + rangeSize);
  for (let r = r1; r < r2 + 1; r++) {
    heightMap.set([q, r], [0, 1, 2, 3, 4][Math.floor(Math.random() * 5)]);
  }
}

export default function Hexgrid(props : ThreeElements["mesh"]) {
  return (
    <>
      <mesh>
        {Array.from(heightMap, (v, k) => {
          const [y, x] = axialToPixel(v[0]);
          return (
            <Hexagon
              key={v.toString()}
              position={[x, y, 0]}
              height={v[1] / 2 + 0.25}
              number={4}
            />
          );
        })}
      </mesh>
    </>
  );
}
