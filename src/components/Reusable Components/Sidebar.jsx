import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-indigo-900 text-white">
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-800 shadow-md">
          <span className="text-2xl mr-2">👥</span>
          <span className="text-xl font-bold">
            Career <span className="text-indigo-300">Crafter</span>
          </span>
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-1">
            <Link
              to="/hr-dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg "
            >
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            <Link
              to="/manage-jobs"
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
            >
              <span className="mr-3">💼</span>
              Manage Jobs
            </Link>
            <Link
              to="/manage-applications"
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
            >
              <span className="mr-3">👥</span>
              Manage Applications
            </Link>
            <Link
              to="/manage-interviews"
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
            >
              <span className="mr-3">📅</span>
              Manage Interviews
            </Link>
          </nav>

          {/* User Profile Section */}
          <div className="mt-auto mb-4">
            <div className="px-4 py-3 text-sm rounded-lg bg-indigo-800 border border-indigo-700">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full border-2 border-indigo-400"
                  src={`/images/${user?.photoUrl?.split("\\").pop()}`}
                  alt="Profile"
                />
                <div className="ml-3">
                  <p className="font-semibold text-white">
                    {user?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-indigo-300">
                    {user?.user?.role || "HR Manager"}
                  </p>
                  <p className="text-xs text-indigo-400 mt-1">
                    {user?.company?.name || "Loading company..."}
                  </p>
                </div>

                <button
                  onClick={() => logout()}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
