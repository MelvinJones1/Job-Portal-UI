import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Reusable Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import fetchUserDetails from "../../store/actions/userActions.js";

const HrDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // States
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalHired, setTotalHired] = useState(0);

  // Fetch user on mount if needed
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (
      !user ||
      (currentToken && user.user?.username !== localStorage.getItem("username"))
    ) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, user]);

  // Fetch recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      if (!user?.id) return;
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8081/api/hr/recent-jobs/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecentJobs(res.data);
    };
    fetchRecentJobs();
  }, [user]);

  // Fetch upcoming interviews
  useEffect(() => {
    const fetchUpcomingInterviews = async () => {
      if (!user?.id) return;
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8081/api/hr/recent-interviews/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecentInterviews(res.data);
    };
    fetchUpcomingInterviews();
  }, [user]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      const token = localStorage.getItem("token");

      const jobsRes = await axios.get(
        `http://localhost:8081/api/hr/total-jobs/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTotalJobs(jobsRes.data);

      const hiresRes = await axios.get(
        `http://localhost:8081/api/hr/total-hires/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTotalHired(hiresRes.data);
    };
    fetchStats();
  }, [user]);

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              <button className="text-gray-500 md:hidden mr-4">
                <span className="text-xl">☰</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard Overview
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src={`/images/${user?.photoUrl?.split("\\").pop()}`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-gray-300"
                />
                <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {/* Welcome Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-premium">
              <h2 className="text-2xl font-semibold">
                Welcome back, {user?.name || "User"}!
              </h2>
              <p className="text-indigo-100">
                Here's your recruitment overview for{" "}
                {user?.company?.name || "Company Name"}.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Jobs Card */}
              <div className="bg-white p-6 rounded-lg shadow-premium border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total No of Jobs Posted
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {totalJobs}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    💼
                  </div>
                </div>
              </div>

              {/* Hired Candidates Card */}
              <div className="bg-white p-6 rounded-lg shadow-premium border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Hired Candidates
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {totalHired}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    👍
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-premium">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/manage-jobs"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  <span className="mr-2">+</span> Post New Job
                </Link>
                <Link
                  to="/manage-applications"
                  className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  <span className="mr-2">📥</span> Review New Applications
                </Link>
              </div>
            </div>

            {/* Grid Layout: Recent Jobs & Interviews */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Jobs Section */}
              <div className="p-6 bg-white rounded-lg shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Job Postings
                  </h2>
                  <Link
                    to="/manage-jobs"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border border-gray-100 rounded hover:bg-gray-50 hover:shadow-sm"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">{job.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              job.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : job.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {job.jobType}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span>{" "}
                            {job.applicationDeadline}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No recent jobs found.
                    </p>
                  )}
                </div>
              </div>

              {/* Upcoming Interviews Section */}
              <div className="p-6 bg-white rounded-lg shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upcoming Interviews
                  </h2>
                  <Link
                    to="/manage-interviews"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Interviews
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentInterviews.length > 0 ? (
                    recentInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="p-4 border border-gray-100 rounded hover:bg-gray-50 hover:shadow-sm"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">
                            {interview.application.jobSeeker?.name ||
                              "Candidate"}
                          </h3>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {interview.application.job.title}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {interview.date}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>{" "}
                            {interview.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No upcoming interviews.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 {user?.company?.name || "Company Name"}. All rights reserved.
            Powered by Career Crafter.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
