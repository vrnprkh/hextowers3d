import { Canvas } from "@react-three/fiber";
import GameScene from "./scenes/GameScene";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Provider store={store}>
      <div className="flex h-full">
        <Sidebar/>
      
        <Canvas
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          shadows={"soft"}
        >
          <GameScene />
          {/* <axesHelper scale={10}></axesHelper> */}
        </Canvas>
      </div>
    </Provider>
  );
}
export default App;
