import {
  changeCurrentTowers,
  changeEdgeSize,
  goToNextLevel,
  goToPreviousLevel,
  selectCurrentEdge,
  selectCurrentEdgeSizeOptions,
  selectCurrentLevelIndex,
  selectCurrentTower,
  selectCurrentTowerOptions,
  selectSidebarStatus,
  selectTotalLevelCount,
} from "../features/UISlice";
import { useAppDispatch } from "../app/hooks";
import { reset, selectWin } from "../features/levelSlice";
import { useSelector } from "react-redux";
import React from "react";

function SidebarButton({
  click,
  children,
  disabled = false,
}: {
  click: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className="text-white bg-gray-500 hover:bg-gray-600 
			self-stretch rounded-sm p-1 w-full disabled:bg-gray-700 disabled:text-gray-400"
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const currentLevel = useSelector(selectCurrentLevelIndex);
  const currentEdge = useSelector(selectCurrentEdge);
  const currentTower = useSelector(selectCurrentTower);
  const currentEdgeOptions = useSelector(selectCurrentEdgeSizeOptions);
  const currentTowerOptions = useSelector(selectCurrentTowerOptions);
  const levelCount = useSelector(selectTotalLevelCount);
  const win = useSelector(selectWin);

  const sidebarVis = useSelector(selectSidebarStatus);

  if (!sidebarVis) {
    return;
  }
  

  return (
    <div className="flex flex-col h-full bg-gray-800 p-2 gap-1 items-center overflow-x-scroll min-w-[250px]">
      <div className="flex text-white self-stretch text-nowrap justify-center p-1">
        Size: {currentEdge} Towers: {currentTower} Level: {currentLevel + 1}/{levelCount}
      </div>
      {/* next and previous level */}
      <div className="flex self-stretch justify-center gap-1">
        <SidebarButton
          click={() => {
            dispatch(goToPreviousLevel());
          }}
        >
          Previous
        </SidebarButton>
        <SidebarButton
          click={() => {
            dispatch(goToNextLevel());
          }}
        >
          Next
        </SidebarButton>
      </div>

      <div className="flex self-stretch justify-center gap-1  text-white  border-gray-500 border p-1">
        {/* edge options */}
        <div className="flex flex-col w-full gap-0.5">
          <div className="flex justify-center">Size</div>
          {currentEdgeOptions.map((e) => (
            <React.Fragment key={`edge-${e}`}>
              <SidebarButton
                click={() => {
                  dispatch(changeEdgeSize(e));
                }}
                disabled={currentEdge === e}
              >
                {e}
              </SidebarButton>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col w-full gap-0.5">
          <div className="flex justify-center">Towers</div>
          {currentTowerOptions.map((e) => (
            <React.Fragment key={`edge-${e}`}>
              <SidebarButton
                click={() => {
                  dispatch(changeCurrentTowers(e));
                }}
                disabled={currentTower === e}
              >
                {e}
              </SidebarButton>
            </React.Fragment>
          ))}
        </div>
        {/*  */}
      </div>

      <span className="h-full" />
      {win && (
        <>
          <div className="text-white text-2xl font-bold">Win!</div>
        </>
      )}

      {/* control spacing */}
      <span className="h-full" />
      <SidebarButton
        click={() => {
          dispatch(reset());
        }}
      >
        Reset
      </SidebarButton>
    </div>
  );
}
