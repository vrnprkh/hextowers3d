import { useState } from "react";

import { useFrame } from "@react-three/fiber";
import Hexgrid from "../components/Hexgrid";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function GameScene() {
  const [rot, setRot] = useState(0);
  // const startAngle = Math.PI / 4;
  useFrame((_, delta) => setRot(rot + delta / 10));

  return (
    <>
      <spotLight
        angle={0.75}
        penumbra={1}
        position={[0, 0, 8]}
        intensity={100}
      />
      <mesh rotation={[0, 0, rot]}>
        <Hexgrid />
      </mesh>
      <PerspectiveCamera
        makeDefault
        far={100}
        position={[0, 0, 10]}
        up={[0, 0, 1]}
      />

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 16}
        maxPolarAngle={(3 * Math.PI) / 8}
        minDistance={12}
        maxDistance={20}
      />
    </>
  );
}
