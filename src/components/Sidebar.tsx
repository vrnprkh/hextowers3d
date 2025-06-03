import { goToNextLevel, goToPreviousLevel, selectCurrentLevelIndex } from "../features/UISlice";
import { useAppDispatch } from "../app/hooks";
import { reset, selectWin } from "../features/levelSlice";
import { useSelector } from "react-redux";

function SidebarButton({
  click,
  children,
}: {
  click: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      className="text-white bg-gray-500 hover:bg-gray-600 
			self-stretch rounded-sm p-1"
      onClick={click}
    >
      {children}
    </button>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
	const currentLevel = useSelector(selectCurrentLevelIndex);
  const win = useSelector(selectWin);
  return (
    <div className="flex flex-col h-full bg-gray-700 p-2 gap-1 items-center">
			<div className="flex text-white self-stretch text-nowrap justify-center">
				Level : {currentLevel}
			</div>
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
      <SidebarButton
        click={() => {
          dispatch(reset());
        }}
      >
        Reset
      </SidebarButton>

      {win && (
        <>
          <div className="text-white text-2xl font-bold">Win!</div>
        </>
      )}
    </div>
  );
}
