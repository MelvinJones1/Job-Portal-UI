import React, { useState } from "react";

const HrSignup = () => {
  const [hrData, setHrData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setHrData({ ...hrData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", hrData);
    // You will call API here later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          HR Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={hrData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={hrData.email}
              onChange={handleChange}
              placeholder="john.doe@company.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={hrData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Company Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              name="companyId"
              value={hrData.companyId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="" disabled>
                Select a company
              </option>
              <option value="1">TCS</option>
              <option value="2">Infosys</option>
              <option value="3">Wipro</option>
              {/* Replace these with dynamic company options later */}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default HrSignup;
