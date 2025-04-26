import React from "react";
import HrDashboard from "./components/HR/HrDashboard";
import Login from "./components/auth/Login";
import { Route, Routes } from "react-router";
import ManageApplications from "./components/Manage Applications/Applications";
import ExecutiveDashboard from "./components/Executive/ExecutiveDashboard";
import Jobs from "./components/Manage Jobs/Jobs";
import Interview from "./components/Manage Interviews/Interviews";
import HrSignup from "./components/auth/HrSignUpForm";

const dummyCompanies = [
  { id: 1, name: "TCS" },
  { id: 2, name: "Infosys" },
  { id: 3, name: "Wipro" },
];

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="hr-signup" element={<HrSignup />} />
      <Route path="hr-dashboard" element={<HrDashboard />} />
      <Route path="executive-dashboard" element={<ExecutiveDashboard />} />
      <Route path="manage-applications" element={<ManageApplications />} />
      <Route path="manage-jobs" element={<Jobs />} />
      <Route path="manage-interviews" element={<Interview />} />
    </Routes>
  );
}

export default App;
