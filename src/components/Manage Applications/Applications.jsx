import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Reusable Components/Sidebar";

function ManageApplications() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");

  // State
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Form states for modals
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [assessmentLink, setAssessmentLink] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");

  const [interviewType, setInterviewType] = useState("");
  const [modeDetails, setModeDetails] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [executiveId, setExecutiveId] = useState("");

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
      fetchJobs();
      fetchExecutives();
    }
  }, [user]);

  // Load applications when job is selected
  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob.id);
    }
  }, [selectedJob]);

  // API Calls

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/job/hr/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setJobs(res.data);
      countApplicants(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const countApplicants = async (jobList) => {
    const counts = {};
    for (const job of jobList) {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/job/${job.id}/applicant-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        counts[job.id] = res.data;
      } catch (err) {
        counts[job.id] = 0;
      }
    }
    setApplicantCounts(counts);
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/application/job/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  const fetchExecutives = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/executive/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExecutives(res.data);
    } catch (err) {
      console.error("Failed to load executives", err);
    }
  };

  // Modal Actions

  const handleSendAssessment = (application) => {
    setSelectedApplication(application);
    setShowAssessmentModal(true);
  };

  const submitAssessment = async () => {
    try {
      await axios.post(
        `http://localhost:8081/api/assessment/send/${selectedApplication.id}`,
        {
          title: assessmentTitle,
          assessmentLink,
          assessmentDate,
          completed: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Assessment sent successfully!");
      setShowAssessmentModal(false);
      resetAssessmentForm();
      fetchApplications(selectedJob.id);
    } catch (err) {
      console.error("Failed to send assessment", err);
      alert("Failed to send assessment");
    }
  };

  const resetAssessmentForm = () => {
    setAssessmentTitle("");
    setAssessmentLink("");
    setAssessmentDate("");
  };

  const handleSendInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const submitInterview = async () => {
    try {
      await axios.post(
        `http://localhost:8081/api/interview/schedule/${selectedApplication.id}/${executiveId}`,
        {
          type: interviewType,
          modeDetails,
          date: interviewDate,
          time: interviewTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Interview scheduled successfully!");
      setShowInterviewModal(false);
      resetInterviewForm();
      fetchApplications(selectedJob.id);
    } catch (err) {
      console.error("Failed to schedule interview", err);
      alert("Failed to schedule interview");
    }
  };

  const resetInterviewForm = () => {
    setInterviewType("");
    setModeDetails("");
    setInterviewDate("");
    setInterviewTime("");
    setExecutiveId("");
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8081/api/application/update-status/${applicationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { status },
        },
      );
      fetchApplications(selectedJob.id);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const sortApplicationsByDate = () => {
    // const sorted = [...applications].sort((a, b) => {
    //   return new Date(b.appliedAt) - new Date(a.appliedAt);
    // });
    // setApplications(sorted);

    const s = [...applications];
    s.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    setApplications(s);
  };

  const viewResume = (filename) => {
    window.open(`/Resumes/${encodeURIComponent(filename)}`, "_blank");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

          {/* Job List */}
          {!selectedJob ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job.department} • {job.location}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {applicantCounts[job.id] || 0} applicants
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedJob(null)}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to all jobs
              </button>

              <div className="bg-white shadow overflow-hidden rounded-lg border">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <button
                    onClick={sortApplicationsByDate}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none cursor-pointer"
                  >
                    Filter by Recent Applicant
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {app.jobSeeker.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {app.jobSeeker.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.status === "HIRED"
                                  ? "bg-green-100 text-green-800"
                                  : app.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : app.status === "SHORTLISTED"
                                  ? "bg-blue-100 text-blue-800"
                                  : app.status === "ASSESSMENT_SENT"
                                  ? "bg-purple-100 text-purple-800"
                                  : app.status === "INTERVIEW_SENT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => viewResume(app.jobSeeker.resume)}
                              className="inline-flex items-center px-3 py-1 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              Resume
                            </button>
                            <button
                              onClick={() => handleSendAssessment(app)}
                              className="inline-flex items-center px-3 py-1 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                            >
                              Assessment
                            </button>
                            <button
                              onClick={() => handleSendInterview(app)}
                              className="inline-flex items-center px-3 py-1 border border-yellow-600 rounded-md text-sm font-medium text-yellow-600 hover:bg-yellow-50 transition-colors"
                            >
                              Interview
                            </button>
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateStatus(app.id, e.target.value)
                              }
                              className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="APPLIED">Applied</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="HIRED">Hired</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Modal */}
          {showAssessmentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium mb-4">Send Assessment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={assessmentTitle}
                      onChange={(e) => setAssessmentTitle(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Link
                    </label>
                    <input
                      type="text"
                      value={assessmentLink}
                      onChange={(e) => setAssessmentLink(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={assessmentDate}
                      onChange={(e) => setAssessmentDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAssessmentModal(false);
                        resetAssessmentForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAssessment}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interview Modal */}
          {showInterviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium mb-4">Schedule Interview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    >
                      <option value="">Select type</option>
                      <option value="Video Call">Video Call</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="In-Person">In-Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Details
                    </label>
                    <input
                      type="text"
                      placeholder="Meeting link or address"
                      value={modeDetails}
                      onChange={(e) => setModeDetails(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Executive
                    </label>
                    <select
                      value={executiveId}
                      onChange={(e) => setExecutiveId(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    >
                      <option value="">Select executive</option>
                      {executives.map((exec) => (
                        <option key={exec.id} value={exec.id}>
                          {exec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowInterviewModal(false);
                        resetInterviewForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitInterview}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageApplications;
