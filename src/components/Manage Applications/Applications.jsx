import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Reusable Components/Sidebar";

function ManageApplications() {
  const user = useSelector((state) => state.user.user);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [executives, setExecutives] = useState([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [assessmentData, setAssessmentData] = useState({
    title: "",
    assessmentLink: "",
    completed: false,
    score: 0,
  });
  const [interviewData, setInterviewData] = useState({
    type: "",
    modeDetails: "",
    date: "",
    time: "",
    executiveId: "",
  });
  const [newScore, setNewScore] = useState(0);
  const [assessments, setAssessments] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
      fetchExecutives();
    }
  }, [user]);

  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob.id);
      fetchAssessmentsForJob(selectedJob.id);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/job/hr/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setJobs(response.data);
      fetchApplicantCounts(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchAssessmentsForJob = async (jobId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/assessment/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const assessmentsMap = {};
      response.data.forEach((assessment) => {
        assessmentsMap[assessment.applicationId] = assessment;
      });
      setAssessments(assessmentsMap);

      // Also update application statuses if needed
      const updatedApplications = applications.map((app) => {
        if (assessmentsMap[app.id]) {
          return { ...app, status: "ASSESSMENT_SENT" };
        }
        return app;
      });
      setApplications(updatedApplications);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const fetchApplicantCounts = async (jobs) => {
    const counts = {};
    for (const job of jobs) {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/job/${job.id}/applicant-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        counts[job.id] = response.data;
      } catch (error) {
        console.error(`Error fetching count for job ${job.id}:`, error);
        counts[job.id] = 0;
      }
    }
    setApplicantCounts(counts);
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/application/job/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchExecutives = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/executive/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setExecutives(response.data);
    } catch (error) {
      console.error("Error fetching executives:", error);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleSendAssessment = (application) => {
    setSelectedApplication(application);
    setShowAssessmentModal(true);
  };

  const handleUpdateScore = (application) => {
    setSelectedApplication(application);
    setNewScore(assessments[application.id]?.score || 0);
    setShowScoreModal(true);
  };

  const handleSendInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const submitAssessment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/assessment/send/${selectedApplication.id}`,
        assessmentData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update both assessments and applications state
      setAssessments((prev) => ({
        ...prev,
        [selectedApplication.id]: response.data,
      }));

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: "ASSESSMENT_SENT" }
            : app,
        ),
      );

      setShowAssessmentModal(false);
    } catch (error) {
      console.error("Error sending assessment:", error);
    }
  };

  const submitScore = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/assessment/update-score/${
          assessments[selectedApplication.id].id
        }?score=${newScore}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAssessments((prev) => ({
        ...prev,
        [selectedApplication.id]: {
          ...prev[selectedApplication.id],
          score: newScore,
        },
      }));

      setShowScoreModal(false);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const submitInterview = async () => {
    try {
      await axios.post(
        `http://localhost:8081/api/interview/schedule/${selectedApplication.id}/${interviewData.executiveId}`,
        {
          type: interviewData.type,
          modeDetails: interviewData.modeDetails,
          date: interviewData.date,
          time: interviewData.time,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowInterviewModal(false);
      fetchApplications(selectedJob.id);
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8081/api/application/update-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchApplications(selectedJob.id);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const viewResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

          {!selectedJob ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleJobClick(job)}
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

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <p className="text-gray-600">
                    {selectedJob.department} • {selectedJob.location}
                  </p>
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
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => {
                        const hasAssessment = !!assessments[application.id];

                        return (
                          <tr key={application.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {application.jobSeeker.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {application.jobSeeker.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                application.appliedAt,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  application.status === "HIRED"
                                    ? "bg-green-100 text-green-800"
                                    : application.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : application.status === "SHORTLISTED"
                                    ? "bg-blue-100 text-blue-800"
                                    : application.status === "ASSESSMENT_SENT"
                                    ? "bg-purple-100 text-purple-800"
                                    : application.status ===
                                      "INTERVIEW_SCHEDULED"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {application.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {hasAssessment
                                ? assessments[application.id].score
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="space-x-2">
                                <button
                                  onClick={() =>
                                    viewResume(application.jobSeeker.resume)
                                  }
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View Resume
                                </button>

                                {!hasAssessment ? (
                                  <button
                                    onClick={() =>
                                      handleSendAssessment(application)
                                    }
                                    className="text-purple-600 hover:text-purple-900"
                                  >
                                    Send Assessment
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleUpdateScore(application)
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Update Score
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    handleSendInterview(application)
                                  }
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Schedule Interview
                                </button>

                                <select
                                  value={application.status}
                                  onChange={(e) =>
                                    updateStatus(application.id, e.target.value)
                                  }
                                  className="border rounded p-1 text-sm"
                                >
                                  <option value="APPLIED">Applied</option>
                                  <option value="SHORTLISTED">
                                    Shortlisted
                                  </option>
                                  <option value="ASSESSMENT_SENT">
                                    Assessment Sent
                                  </option>
                                  <option value="INTERVIEW_SCHEDULED">
                                    Interview Scheduled
                                  </option>
                                  <option value="HIRED">Hired</option>
                                  <option value="REJECTED">Rejected</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={assessmentData.title}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assessment Link
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={assessmentData.assessmentLink}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      assessmentLink: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAssessmentModal(false)}
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

      {/* Score Update Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">
              Update Assessment Score
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitScore}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update Score
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
                  Interview Type
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={interviewData.type}
                  onChange={(e) =>
                    setInterviewData({ ...interviewData, type: e.target.value })
                  }
                >
                  <option value="">Select type</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meeting Details
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={interviewData.modeDetails}
                  onChange={(e) =>
                    setInterviewData({
                      ...interviewData,
                      modeDetails: e.target.value,
                    })
                  }
                  placeholder="Meeting link or address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={interviewData.date}
                  onChange={(e) =>
                    setInterviewData({ ...interviewData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={interviewData.time}
                  onChange={(e) =>
                    setInterviewData({ ...interviewData, time: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Executive
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={interviewData.executiveId}
                  onChange={(e) =>
                    setInterviewData({
                      ...interviewData,
                      executiveId: e.target.value,
                    })
                  }
                >
                  <option value="">Select executive</option>
                  {executives.map((executive) => (
                    <option key={executive.id} value={executive.id}>
                      {executive.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowInterviewModal(false)}
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
  );
}

export default ManageApplications;
