import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

import ErrorPage from "./pages/error/ErrorPage";
import DashboardPage from "./pages/DashboardPage";
import DailyReports from "./pages/DailyReports";
import AllReports from "./pages/AllReports";
// import AllReportsComp from "./pages/AllReportsComp";
import NewReport from "./report/NewReport";
import AssignedReports from "./pages/AssignedReports";
import PublicLayout from "./layout/PublicLayout";
import BackendLayout from "./layout/BackendLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Toaster } from "react-hot-toast";
import PublicRoute from "./Auth/PublicRoute";
import ResolvedReports from "./pages/ResolvedReports";
import PendingApproval from "./pages/PendingApproval";
// import NewReport from './'

function App() {

  // Sidebar View
  return (
    <>
    <Toaster
      position="top-right"
      gutter={12}
      containerClassName="app-toaster"
      toastOptions={{
        className: "app-toast",
        duration: 3500,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
        success: {
          className: "app-toast app-toast--success",
          icon: null,
        },
        error: {
          className: "app-toast app-toast--error",
          icon: null,
        },
        loading: {
          className: "app-toast app-toast--loading",
        },
      }}
    />
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/new-report" element={<NewReport />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>} />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <BackendLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/daily-reports" element={<DailyReports />} />
        <Route path="/all-reports" element={<AllReports />} />
        {/* <Route path="/all-reports-comp" element={<AllReportsComp />} /> */}
        <Route path="/assigned-reports" element={<AssignedReports />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/resolved-reports" element={<ResolvedReports />} />
      </Route>

      {/* Catch all an redirect to New Report */}
      {/* <Route path="*" element={<Navigate to="/new-report" />} /> */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    </>
  );
}

export default App;
