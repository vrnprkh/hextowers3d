import { useDispatch } from "react-redux";
import { toggleSideBar } from "../features/UISlice";

export default function SidebarToggle() {
	const dispatch = useDispatch();
  return (
    <div>
      <button className="p-1 hover:bg-gray-500 rounded"
			onClick={() => dispatch(toggleSideBar())}>
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="w-6"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>
    </div>
  );
}
