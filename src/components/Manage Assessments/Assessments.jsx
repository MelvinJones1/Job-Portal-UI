import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Reusable Components/Sidebar";

function Assessments() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");

  // State
  const [assessments, setAssessments] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  // Fetch assessments on page change or user load
  useEffect(() => {
    if (user?.id) {
      fetchAssessments(page);
    }
  }, [user, page]);

  // Load assessments
  const fetchAssessments = async (pageNum) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/assessment/all/hr/${user.id}?page=${pageNum}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data;
      setAssessments(data);
      setHasMore(data.length >= size); // More pages available?
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      setHasMore(false);
    }
  };

  // Open modal to update score
  const handleUpdateScore = (assessment) => {
    setSelectedAssessmentId(assessment.id);
    setNewScore(assessment.score || 0);
    setShowScoreModal(true);
  };

  // Submit updated score
  const submitScore = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/assessment/update-score/${selectedAssessmentId}?score=${newScore}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowScoreModal(false);
      fetchAssessments(page); // Refresh current page
    } catch (error) {
      console.error("Failed to update score", error);
    }
  };

  // Pagination controls
  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Manage Assessments</h1>
          <p className="mb-6 text-gray-600">
            View and manage all assessments you've sent to candidates.
          </p>

          {/* Assessment Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {assessments.length > 0 ? (
                    assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assessment.application.job.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assessment.application.jobSeeker.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {assessment.application.jobSeeker.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assessment.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            assessment.assessmentDate,
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.score !== null ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {assessment.score}
                            </span>
                          ) : (
                            "Not scored yet"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUpdateScore(assessment)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Update Score
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No assessments sent yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className={`px-4 py-2 rounded ${
                    page === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {page + 1}</span>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className={`px-4 py-2 rounded ${
                    !hasMore
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for updating score */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
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
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={submitScore}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Update Score
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessments;
