import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fetchUserDetails from "../../store/actions/userActions.js";

function ExecutiveDashboard() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({}); // key: interviewId

  const dispatch = useDispatch();
  useEffect(() => {
    const currentToken = localStorage.getItem("token");

    if (
      !user ||
      (currentToken && user.user?.username !== localStorage.getItem("username"))
    ) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8081/api/interview/executive/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setInterviews(res.data);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
      alert("Failed to load interviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (id, text) => {
    setFeedbackMap((prev) => ({ ...prev, [id]: text }));
  };

  const submitFeedback = async (interviewId) => {
    const feedback = feedbackMap[interviewId];
    if (!feedback || !feedback.trim()) {
      return alert("Please enter feedback before submitting.");
    }

    try {
      setSubmittingId(interviewId);
      await axios.put(
        `http://localhost:8081/api/interview/addFeedback/${interviewId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { feedback },
        },
      );
      alert("Feedback submitted successfully!");
      fetchInterviews();
    } catch (err) {
      console.error("Feedback submission failed", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start flex-col md:flex-row mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
              Executive Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage interviews and submit your feedback
            </p>
          </div>

          {/* Profile Card with Logout */}
          <div className="flex items-center mt-6 md:mt-0 space-x-4">
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md border border-indigo-200">
              <img
                className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover"
                src={`/images/${user?.photoUrl?.split("\\").pop()}`}
                alt="Profile"
              />
              <div className="ml-4">
                <p className="font-bold text-indigo-800">{user?.name}</p>
                <p className="text-sm text-gray-500">
                  {user?.user?.role || "Executive"}
                </p>
                <p className="text-sm text-indigo-600">
                  {user?.company?.name || "Loading..."}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Interviews */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-b-4"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-xl">No interviews assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border border-indigo-100 hover:shadow-xl transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-800">
                      {interview.application.job.title}
                    </h2>
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {interview.type}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="font-medium">
                      👤 {interview.application.jobSeeker.name}
                    </div>
                    <div>
                      📅 {interview.date} at 🕒 {interview.time}
                    </div>
                    <div>
                      🌐{" "}
                      {interview.type === "Video Call" ? (
                        <a
                          href={interview.modeDetails}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline hover:text-indigo-800"
                        >
                          Join Video Call
                        </a>
                      ) : (
                        <span>{interview.modeDetails}</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="mt-5">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Existing Feedback:
                    </p>
                    <div
                      className={`text-sm p-3 rounded bg-gray-100 ${
                        interview.feedback
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      }`}
                    >
                      {interview.feedback || "No feedback provided yet"}
                    </div>
                  </div>
                </div>

                {/* Feedback Input */}
                <div className="mt-6">
                  <textarea
                    rows={3}
                    value={feedbackMap[interview.id] || ""}
                    onChange={(e) =>
                      handleFeedbackChange(interview.id, e.target.value)
                    }
                    placeholder="Write your feedback here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={() => submitFeedback(interview.id)}
                    disabled={
                      submittingId === interview.id ||
                      !feedbackMap[interview.id]?.trim()
                    }
                    className={`mt-3 w-full py-2 px-4 rounded-md font-semibold transition duration-200 ${
                      submittingId === interview.id
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {submittingId === interview.id
                      ? "Submitting..."
                      : "Submit Feedback"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutiveDashboard;
