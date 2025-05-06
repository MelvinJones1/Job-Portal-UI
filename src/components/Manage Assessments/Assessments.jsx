import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Reusable Components/Sidebar";

function Assessments() {
  const user = useSelector((state) => state.user.user);
  const [assessments, setAssessments] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', or 'desc'

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.id) {
      fetchAssessments();
    }
  }, [user, page]); // Add page to dependencies

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/assessment/all/hr/${user.id}?page=${page}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAssessments(response.data);
      setHasMore(response.data.length >= size);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      setHasMore(false);
    }
  };

  const handleUpdateScore = (assessment) => {
    setSelectedAssessment(assessment);
    setNewScore(assessment.score || 0);
    setShowScoreModal(true);
  };

  const submitScore = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/assessment/update-score/${selectedAssessment.id}?score=${newScore}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAssessments();
      setShowScoreModal(false);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const toggleSortOrder = () => {
    // Cycle through sort orders: null -> 'asc' -> 'desc' -> null
    setSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
    setPage(0); // Reset to first page when sorting changes
  };

  // Sort assessments based on sortOrder
  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortOrder === null) return 0;

    // Handle null scores (treat them as -Infinity for sorting)
    const scoreA = a.score !== null ? a.score : -Infinity;
    const scoreB = b.score !== null ? b.score : -Infinity;

    return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Manage Assessments</h1>
          <p className="mb-6 text-gray-600">
            View and manage all assessments you've sent to candidates
          </p>

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
                      Sent Date
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={toggleSortOrder}
                    >
                      <div className="flex items-center">
                        Score
                        {sortOrder === "asc" && <span className="ml-1">↑</span>}
                        {sortOrder === "desc" && (
                          <span className="ml-1">↓</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAssessments.length > 0 ? (
                    sortedAssessments.map((assessment) => (
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
                          {new Date(assessment.sentDate).toLocaleDateString()}
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

              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className={`px-4 py-2 rounded-lg ${
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
                  className={`px-4 py-2 rounded-lg ${
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
                  Score (0-100)
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
    </div>
  );
}

export default Assessments;
