import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const BackendLayout = () => {
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
    <div className="app-shell">
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
            <span className="ms-1 fw-semibold top-navbar-title">FraudWatch</span>
          </div>
        </header>
      )}

      <div className="d-flex app-body">
        <Sidebar
          isMobile={isMobile}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          onClose={() => setIsSidebarCollapsed(true)}
        />

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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendLayout;
