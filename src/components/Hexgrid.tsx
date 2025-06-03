import Hexagon from "./Hexagon";
import { axialToPixel } from "../util/hexagonUtils";
import type { ThreeElements } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { selectIndexes } from "../features/levelSlice";


// todo fix this lol...
let renderCycle = 0;
function getPrefix() {
  renderCycle++;
  return `${renderCycle}.`
}

export default function Hexgrid(props: ThreeElements["mesh"]) {

  const tileIndexes = useSelector(selectIndexes);
  return (
    <>
      <mesh {...props}>
        {tileIndexes.map((index) => {
          const [y, x] = axialToPixel(index);
          return <Hexagon key={`${getPrefix()}${index[0]}.${index[1]}`} coords={index} position={[x, y, 0]} />;
        })}
      </mesh>
    </>
  );
}
