import { useEffect } from "react";

import Hexgrid from "../components/Hexgrid";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { useAppDispatch } from "../app/hooks";
import { startGame } from "../features/UISlice";

export default function GameScene() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(startGame());
  }, []);
  return (
    <>
      <spotLight
        angle={0.3}
        penumbra={1}
        position={[10, 10, 20]}
        intensity={350}
        castShadow={true}        
      />
      <ambientLight
        intensity={0.75}
      />
      <mesh rotation={[0, 0, 0]}>
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
        minPolarAngle={0}
        maxPolarAngle={(3 * Math.PI) / 8}
        minDistance={10}
        maxDistance={30}
      />
    </>
  );
}
