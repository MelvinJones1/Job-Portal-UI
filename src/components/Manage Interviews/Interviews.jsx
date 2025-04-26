import { Link } from "react-router";

function Interview() {
  const user = {
    name: "Sarah Johnson",
    role: "HR Manager",
    company: "Hexaware Technologies",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };
  const renderIcon = (type) => {
    switch (type) {
      case "dashboard":
        return "📊";
      case "jobs":
        return "💼";
      case "applications":
        return "👥";
      case "calendar":
        return "📅";
      case "logout":
        return "🚪";
      case "menu":
        return "☰";
      case "plus":
        return "+";
      case "video":
        return "🎥";
      case "user":
        return "👔";
      case "building":
        return "🏢";
      case "inbox":
        return "📥";
      default:
        return "⚙️";
    }
  };
  return (
    <div className="bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
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
                  to={"/hr-dashboard"}
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-white bg-indigo-800 rounded-lg"
                >
                  <span className="mr-3">{renderIcon("dashboard")}</span>
                  Dashboard
                </Link>
                <Link
                  to={"/manage-jobs"}
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
                >
                  <span className="mr-3">{renderIcon("jobs")}</span>
                  Manage Jobs
                </Link>
                <Link
                  to="/manage-applications"
                  className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
                >
                  <span className="mr-3">{renderIcon("applications")}</span>
                  Manage Applications
                </Link>

                <Link
                  to={"/manage-interviews"}
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg"
                >
                  <span className="mr-3">{renderIcon("calendar")}</span>
                  Manage Interviews
                </Link>
              </nav>

              {/* User Profile Section in Sidebar */}
              <div className="mt-auto mb-4">
                <div className="px-4 py-3 text-sm rounded-lg bg-indigo-800 border border-indigo-700">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-indigo-400"
                      src={user.avatar}
                      alt="Profile"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-indigo-300">{user.role}</p>
                      <p className="text-xs text-indigo-400 mt-1">
                        {user.company}
                      </p>
                    </div>
                    <button
                      className="ml-auto text-indigo-300 hover:text-white focus:outline-none"
                      title="Logout"
                    >
                      <span>{renderIcon("logout")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
