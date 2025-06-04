import {
  changeCurrentTowers,
  changeEdgeSize,
  goToLevel,
  goToNextLevel,
  goToPreviousLevel,
  selectSidebarUIInfo,
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
  // maybe move this into one selector lol
  const dispatch = useAppDispatch();
  const win = useSelector(selectWin);

  const {
    currentLevel,
    currentEdge,
    currentTower,
    currentEdgeOptions,
    currentTowerOptions,
    levelCount,
    sidebarVisible,
  } = useSelector(selectSidebarUIInfo);

  if (!sidebarVisible) {
    return;
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 p-2 gap-1 items-center overflow-x-scroll">
      <div className="flex text-white self-stretch text-nowrap justify-center p-1">
        {currentEdge}-{currentTower}-{currentLevel + 1}
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

      <div className="grid grid-cols-3 gap-1 text-white border-gray-500 border p-1">
        {/* edge options */}
        <div className="flex flex-col gap-0.5">
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

        <div className="flex flex-col gap-0.5">
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
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-center">Level</div>
          {[...Array(levelCount).keys()].map((e) => (
            <React.Fragment key={`tower-${e}`}>
              <SidebarButton
                click={() => {
                  dispatch(goToLevel(e));
                }}
                disabled={currentLevel === e}
              >
                {e + 1}
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
