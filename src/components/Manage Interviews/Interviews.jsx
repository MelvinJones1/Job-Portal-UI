import { useEffect, useState } from "react";
import Sidebar from "../Reusable Components/Sidebar";
import axios from "axios";

function Interview() {
  const [interviews, setInterviews] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(4); // fixed size per page
  const [hasMore, setHasMore] = useState(true); // tracks if there's more data

  useEffect(() => {
    fetchInterviews();
  }, [page]);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/interview/all?page=${page}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setInterviews(response.data);
      setHasMore(response.data.length >= size);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  const handleRescheduleClick = (id) => {
    setInterviewId(id);
    setNewDate("");
    setNewTime("");
    setShowModal(true);
  };

  const handleRescheduleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/interview/reschedule/${interviewId}`,
        { date: newDate, time: newTime },
      );
      setShowModal(false);
      alert("Interview Rescheduled Successfully");
      fetchInterviews();
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar full height */}
      <div className="flex h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Interviews
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Candidate</th>
                <th className="px-6 py-4 text-left">Position</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Time</th>
                <th className="px-6 py-4 text-left">Interviewer</th>
                <th className="px-6 py-4 text-left">Feedback</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interviews.length > 0 ? (
                interviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      {interview.application.jobSeeker.name}
                    </td>
                    <td className="px-6 py-4">
                      {interview.application.job.title}
                    </td>
                    <td className="px-6 py-4">{interview.date}</td>
                    <td className="px-6 py-4">{interview.time}</td>
                    <td className="px-6 py-4">{interview.executive.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          interview.feedback
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {interview.feedback || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRescheduleClick(interview.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg shadow"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No interviews scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page + 1}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Reschedule Interview
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Date
              </label>
              <input
                type="date"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Time
              </label>
              <input
                type="time"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
