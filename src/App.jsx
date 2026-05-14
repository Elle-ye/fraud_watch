import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

import DashboardPage from "./pages/DashboardPage";
import DailyReports from "./pages/DailyReports";
import AllReports from "./pages/AllReports";
import NewReport from "./report/NewReport";
import PublicLayout from "./layout/PublicLayout";
import BackendLayout from "./layout/BackendLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    {/* Toaster */}
    <Toaster 
        position="top-right"
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '16px',
            borderRadius: '10px',
          },
          // Custom styles per type
          success: {
            icon: '✅',
            style: {
              background: '#28a745', // Bootstrap success green
              color: 'white',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: '#dc3545', // Bootstrap danger red
              color: 'white',
            },
          },
        }}
      />
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/new-report" element={<NewReport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Route>

      {/* Catch all an redirect to New Report */}
      <Route path="*" element={<Navigate to="/new-report" replace />} />
    </Routes>
    </>
  );
}

export default App;
