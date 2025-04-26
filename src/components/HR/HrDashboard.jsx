import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const HrDashboard = () => {
  // Dummy data
  const user = {
    name: "Sarah Johnson",
    role: "HR Manager",
    company: "Hexaware Technologies",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  const [recentjobs, setRecentJobs] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);

  useEffect(() => {
    const getRecentJobs = async () => {
      const response = await axios.get();
      setRecentJobs(response.data);
    };

    const getRecentInterviews = async () => {
      try {
        const response = await axios.get("");
        setRecentInterviews(response.data);
      } catch (error) {}
    };
    getRecentJobs();
    getRecentInterviews();
  });

  const recentJobs = [
    {
      title: "Senior Frontend Developer",
      status: "Active",
      posted: "2 days ago",
      applications: 32,
    },
    {
      title: "UX Designer",
      status: "Active",
      posted: "1 week ago",
      applications: 18,
    },
    {
      title: "DevOps Engineer",
      status: "Draft",
      posted: "Draft saved yesterday",
      applications: null,
    },
  ];

  const upcomingInterviews = [
    {
      name: "John Smith",
      role: "Frontend Dev",
      time: "10:00 AM",
      type: "Technical Interview",
      iconType: "video",
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      time: "2:30 PM",
      type: "Portfolio Review",
      iconType: "user",
    },
    {
      name: "Michael Brown",
      role: "DevOps Eng",
      time: "4:00 PM",
      type: "Final Round",
      iconType: "building",
    },
  ];

  // Simple icon renderer using text symbols
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
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-white bg-indigo-800 rounded-lg"
                >
                  <span className="mr-3">{renderIcon("dashboard")}</span>
                  Dashboard
                </a>
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

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation */}
          <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              {/* Mobile Sidebar Toggle */}
              <button className="text-gray-500 focus:outline-none md:hidden mr-4">
                <span className="text-xl">{renderIcon("menu")}</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard Overview
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  className="w-9 h-9 rounded-full border border-gray-300"
                  src={user.avatar}
                  alt="Profile"
                />
                <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {/* Welcome Message */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-premium">
              <h2 className="text-2xl font-semibold">
                Welcome back, {user.name}!
              </h2>
              <p className="text-indigo-100">
                Here's your recruitment overview for {user.company}.
              </p>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-premium">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="mr-2">{renderIcon("plus")}</span> Post New
                  Job
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="mr-2">{renderIcon("calendar")}</span> View
                  Today's Schedule
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span className="mr-2">{renderIcon("inbox")}</span> Review New
                  Applications
                </a>
              </div>
            </div>

            {/* Simplified Grid: Recent Jobs & Upcoming Interviews */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Jobs */}
              <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Job Postings
                  </h2>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View All
                  </a>
                </div>
                <div className="space-y-4">
                  {recentJobs.map((job, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate w-4/5">
                          {job.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                            job.status === "Active"
                              ? "text-green-800 bg-green-100"
                              : "text-yellow-800 bg-yellow-100"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {job.posted}
                        {job.applications && (
                          <span className="font-medium text-gray-700">
                            {" "}
                            • {job.applications} apps
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upcoming Interviews (Today)
                  </h2>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Schedule
                  </a>
                </div>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate w-3/4">
                          {interview.name}
                          <span className="text-gray-500 text-xs">
                            ({interview.role})
                          </span>
                        </h3>
                        <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {interview.time}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="mr-1">
                          {renderIcon(interview.iconType)}
                        </span>{" "}
                        {interview.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 {user.company}. All rights reserved. Powered by Career
            Crafter.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
