// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isMobile, isCollapsed, onToggle, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Logged out successfully');
    navigate('/dashboard');
    if (isMobile) onClose();
  };

  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 app-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isMobile ? 'is-mobile' : ''}`}
      >
        {!isMobile && <div className="d-flex align-items-center justify-content-between p-3 border-bottom app-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-shield-alt text-white fs-4"></i>
            {!isCollapsed && <span className="text-white fw-bold fs-5">FraudWatch</span>}
          </div>
          <button
            className="btn btn-sm text-white app-sidebar-toggle"
            onClick={onToggle}
          >
            <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
          </button>
        </div>}
        

        <div className="flex-grow-1 py-3">
            {/* Nav Menu */}
          <ul className="nav nav-pills flex-column mb-auto px-2">

            {/* Dashboard */}
          <li className="nav-item mb-2">
              <NavLink
                to="/dashboard"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? 'active' : 'text-white-50'}`
                }
              >
                <i className="fas fa-tachometer-alt"></i>
                {!isCollapsed && <span>Dashboard</span>}
              </NavLink>
            </li>

                {/* New Report */}
            <li className="nav-item mb-2">
              <NavLink
                to="/new-report"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? 'active' : 'text-white-50'}`
                }
              >
                <i className="fas fa-file-alt"></i>
                {!isCollapsed && <span>New Report</span>}
              </NavLink>
            </li>

            {/* Daily Reports */}
            <li className="nav-item mb-2">
              <NavLink
                to="/daily-reports"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? 'active' : 'text-white-50'}`
                }
              >
                <i className="fas fa-calendar-day"></i>
                {!isCollapsed && <span>Daily Reports</span>}
              </NavLink>
            </li>

            {/* All Reports */}
            <li className="nav-item mb-2">
              <NavLink
                to="/all-reports"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? 'active' : 'text-white-50'}`
                }
              >
                <i className="fas fa-list-alt"></i>
                {!isCollapsed && <span>All Reports</span>}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="border-top p-3 app-sidebar-footer">
          <button
            className="btn w-100 d-flex align-items-center gap-3 text-white-50 app-logout-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {isMobile && !isCollapsed && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 app-sidebar-overlay"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;