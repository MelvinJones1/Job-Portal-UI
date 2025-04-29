import { Link } from "react-router";
import Sidebar from "../Reusable Components/Sidebar";

function Interview() {
  return (
    <div className="bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
      </div>
    </div>
  );
}

export default Interview;
