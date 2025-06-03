import { useEffect } from "react";

import Hexgrid from "../components/Hexgrid";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useDispatch } from "react-redux";
import { load } from "../features/levelSlice";
import { levels } from "../data/data";

export default function GameScene() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(load(levels[0]));
  }, []);
  return (
    <>
      <spotLight
        angle={0.75}
        penumbra={0.5}
        position={[0, 10, 10]}
        intensity={150}
      />
      <ambientLight
        intensity={1}

        
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
        minPolarAngle={Math.PI / 16}
        maxPolarAngle={(3 * Math.PI) / 8}
        minDistance={12}
        maxDistance={20}
      />
    </>
  );
}
