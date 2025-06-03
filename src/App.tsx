import { Canvas } from "@react-three/fiber";
import "./App.css";
import GameScene from "./scenes/GameScene";
import { Provider } from "react-redux";
import { store } from "./app/store";


function App() {
  return (
    <Provider store={store}>
      <Canvas
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        shadows={"soft"}
        
      >
        <GameScene />
        {/* <axesHelper scale={10}></axesHelper> */}
      </Canvas>
    </Provider>
  );
}
export default App;
