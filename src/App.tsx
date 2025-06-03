import { Canvas } from "@react-three/fiber";
import "./App.css";
import GameScene from "./scenes/GameScene";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import { useEffect } from "react";
import { load } from "./features/levelSlice";
import { levels } from "./data/data";

function App() {
  return (
    <Provider store={store}>
      <Canvas
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <GameScene />
        {/* <axesHelper scale={10}></axesHelper> */}
      </Canvas>
    </Provider>
  );
}
export default App;
