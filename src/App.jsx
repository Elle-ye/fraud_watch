import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import DailyReports from "./pages/DailyReports";
import AllReports from "./pages/AllReports";
import NewReport from "./pages/NewReport";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    // Whole App Container
    <div className="app-shell">
      {/* Top Navbar */}
      {isMobile && (
        <header className="top-navbar d-flex align-items-center px-3">
          <button
            type="button"
            className="btn btn-sm text-white app-nav-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            <i
              className={`fas ${isSidebarCollapsed ? "fa-bars" : "fa-times"}`}
            ></i>
          </button>
          <div className="d-flex align-items-center ms-3">
            <i className="fas fa-shield-alt fs-4"></i>
            <span className="ms-1 fw-semibold top-navbar-title">
              FraudWatch
            </span>
          </div>
        </header>
      )}

      {/* Main Content Container */}
      <div className="d-flex app-body">
        {/* Sidebar */}
        <Sidebar
          isMobile={isMobile}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          onClose={() => setIsSidebarCollapsed(true)}
        />

        {/* Main Content */}
        <div className="main-content">
          <div
            className={`flex-grow-1 overflow-auto app-content app-content-bg ${
              isMobile
                ? "app-content-mobile"
                : isSidebarCollapsed
                  ? "app-content-collapsed"
                  : "app-content-expanded"
            }`}
          >
            {/* Routes */}
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/new-report" element={<NewReport />} />
              <Route path="/daily-reports" element={<DailyReports />} />
              <Route path="/all-reports" element={<AllReports />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
