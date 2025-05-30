import React, { useEffect } from "react";
import HrDashboard from "./components/HR/HrDashboard";
import Login from "./components/auth/Login";
import { Route, Routes } from "react-router";
import ManageApplications from "./components/Manage Applications/Applications";
import ExecutiveDashboard from "./components/Executive/ExecutiveDashboard";
import Jobs from "./components/Manage Jobs/Jobs";
import Interview from "./components/Manage Interviews/Interviews";
import HrSignup from "./components/auth/HrSignUpForm";
// import { useDispatch, useSelector } from "react-redux";
// import fetchUserDetails from "./store/actions/userActions";
import ExecutiveSignup from "./components/auth/ExecutiveSignUpForm";
import Assessments from "./components/Manage Assessments/Assessments";

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="hr-signup" element={<HrSignup />} />
      <Route path="executive-signup" element={<ExecutiveSignup />} />
      <Route path="hr-dashboard" element={<HrDashboard />} />
      <Route path="executive-dashboard" element={<ExecutiveDashboard />} />
      <Route path="manage-applications" element={<ManageApplications />} />
      <Route path="/manage-assessments" element={<Assessments />} />
      <Route path="manage-jobs" element={<Jobs />} />
      <Route path="manage-interviews" element={<Interview />} />
    </Routes>
  );
}

export default App;
