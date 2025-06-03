import { Canvas } from "@react-three/fiber";
import "./App.css";
import GameScene from "./scenes/GameScene";


function App() {

  return (

      <Canvas
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <GameScene />
        {/* <axesHelper scale={10}></axesHelper> */}
      </Canvas>

  );
}
export default App;
