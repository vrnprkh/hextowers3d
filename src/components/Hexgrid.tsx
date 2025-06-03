import Hexagon from "./Hexagon";
import { axialToPixel } from "../util/hexagonUtils";
import type { ThreeElements } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { selectIndexes } from "../features/levelSlice";
import { nanoid } from "@reduxjs/toolkit";

export default function Hexgrid(props: ThreeElements["mesh"]) {
  const tileIndexes = useSelector(selectIndexes);
  return (
    <>
      <mesh {...props}>
        {tileIndexes.map((index) => {
          const [y, x] = axialToPixel(index);
          return <Hexagon key={nanoid()} coords={index} position={[x, y, 0]} />;
        })}
      </mesh>
    </>
  );
}
