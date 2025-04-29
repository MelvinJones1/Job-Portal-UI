import { useState } from "react";
import { useNavigate } from "react-router";
import users from "../data/user";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [userData, setUserData] = useState(users);
  const navigate = useNavigate();

  const login = async () => {
    let isCorrect = false;

    if (!username.trim()) {
      setUsernameMsg("Username cannot be blank");
      return;
    } else {
      setUsernameMsg("");
    }

    if (!password.trim()) {
      setPasswordMsg("Password cannot be blank");
      return;
    } else {
      setPasswordMsg("");
    }

    let body = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/token/generate",
        body,
      );
      console.log(response);
      const token = response.data.token;
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      const resp = await axios.get(
        "http://localhost:8081/api/auth/user/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(resp.data);
      switch (resp.data.role) {
        case "HR":
          navigate("/hr-dashboard");
          break;

        case "EXECUTIVE":
          break;
        default:
          break;
      }
    } catch (error) {
      setUsernameMsg("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <span className="text-xl font-bold text-gray-800">CareerCrafter</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Login</h2>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Error Messages */}
              {usernameMsg && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                  {usernameMsg}
                </div>
              )}
              {passwordMsg && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                  {passwordMsg}
                </div>
              )}

              {/* Username Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameMsg("");
                  }}
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordMsg("");
                  }}
                  placeholder="Enter your password"
                />
              </div>

              {/* Login Button */}
              <button
                onClick={login}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Login
              </button>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an Account?{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Sign Up
                </a>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                <a href="#" className="text-indigo-600 hover:underline">
                  Reset Password
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
