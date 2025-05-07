import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Reusable Components/Sidebar";
import { useSelector } from "react-redux";

function Jobs() {
  const user = useSelector((state) => state.user.user);

  // Job Form Fields
  const [jobId, setJobId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [status, setStatus] = useState("DRAFT");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [benefits, setBenefits] = useState("");

  // Other states
  const [jobs, setJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Job types and statuses
  const JOB_TYPES = ["FULL_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"];
  const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"];

  // Fetch all jobs on mount
  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);

  // Load job list
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/job/hr/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to load jobs");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setJobId("");
    setTitle("");
    setDescription("");
    setRequirements("");
    setSalaryRange("");
    setLocation("");
    setDepartment("");
    setJobType("FULL_TIME");
    setStatus("DRAFT");
    setApplicationDeadline("");
    setBenefits("");
  };

  // Handle new job post
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.post(
        "http://localhost:8081/api/job/add",
        {
          title,
          description,
          requirements,
          salaryRange,
          location,
          department,
          jobType,
          status,
          applicationDeadline,
          benefits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Job posted successfully!");
      setShowPostForm(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job");
    }
  };

  // Delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  // Start editing a job
  const startEditing = (job) => {
    setJobId(job.id);
    setTitle(job.title);
    setDescription(job.description);
    setRequirements(job.requirements);
    setSalaryRange(job.salaryRange);
    setLocation(job.location);
    setDepartment(job.department);
    setJobType(job.jobType);
    setStatus(job.status);
    setApplicationDeadline(job.applicationDeadline);
    setBenefits(job.benefits || "");
    setIsEditing(true);
  };

  // Update existing job
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/job/update/${jobId}`,
        {
          title,
          description,
          requirements,
          salaryRange,
          location,
          department,
          jobType,
          status,
          applicationDeadline,
          benefits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Job updated successfully");
      setIsEditing(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
            {!isEditing && (
              <button
                onClick={() => {
                  resetForm();
                  setShowPostForm(!showPostForm);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
              >
                {showPostForm ? "Cancel" : "Post New Job"}
              </button>
            )}
          </div>

          {/* Post/Edit Job Form */}
          {(showPostForm || isEditing) && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {isEditing ? "Edit Job" : "Post New Job"}
              </h2>
              <form
                onSubmit={isEditing ? handleUpdateJob : handlePostJob}
                className="space-y-6"
              >
                {/* Basic Info Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Job Title*", value: title, onChange: setTitle },
                    {
                      label: "Department*",
                      value: department,
                      onChange: setDepartment,
                    },
                    {
                      label: "Location*",
                      value: location,
                      onChange: setLocation,
                    },
                    {
                      label: "Salary Range*",
                      value: salaryRange,
                      onChange: setSalaryRange,
                    },
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  ))}

                  {/* Dropdowns */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type*
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {JOB_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status*
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {JOB_STATUSES.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline*
                    </label>
                    <input
                      type="date"
                      value={applicationDeadline}
                      onChange={(e) => setApplicationDeadline(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Text Areas */}
                {[
                  {
                    label: "Description*",
                    value: description,
                    onChange: setDescription,
                    rows: 4,
                  },
                  {
                    label: "Requirements*",
                    value: requirements,
                    onChange: setRequirements,
                    rows: 4,
                  },
                  {
                    label: "Benefits",
                    value: benefits,
                    onChange: setBenefits,
                    rows: 3,
                  },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <textarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={field.rows}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.label.endsWith("*")}
                    />
                  </div>
                ))}

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowPostForm(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isEditing ? "Update Job" : "Post Job"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Posted Jobs
              </h2>
            </div>

            {/* Empty State */}
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  No jobs posted yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by posting your first job opening
                </p>
                {!showPostForm && !isEditing && (
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Post New Job
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              job.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : job.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {job.jobType.replace("_", " ")} • {job.department}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            📍 {job.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            💰 {job.salaryRange}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            ⏳ Deadline: {job.applicationDeadline}
                          </div>
                        </div>

                        <p className="mt-4 text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                        <button
                          onClick={() => startEditing(job)}
                          className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
