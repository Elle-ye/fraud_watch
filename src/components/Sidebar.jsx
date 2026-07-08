// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {  useState } from "react";
import "./Sidebar.css";
import LogoutModal from "./LogoutModal";
import { useAuth } from "../context/useAuth";
// import { supabase } from "../config/supabase";

const Sidebar = ({ isMobile, isCollapsed, onToggle, onClose }) => {

  // Logout Modal
  const [modalShow, setModalShow] = useState(false);
  // const [profile, setProfile] = useState();
  const { profile, loading } = useAuth();

  // Fetch user profile
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) return;

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("full_name, role")
  //       .eq("id", user.id)
  //       .single();

  //     if (error) {
  //       console.log("Error fetching User Profile: ", error);
  //       return null;
  //     } else {
  //       setProfile(data);
  //     }
  //   };
  //   fetchUserProfile();
  // }, []);

  if (loading || !profile) {return null};
  // if (!profile) return null;

  const initials = profile?.full_name
    ?.split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const displayRole =
    profile.role?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Staff";

  const roleClass = profile.role
    ? `role-badge--${profile.role.replace(/_/g, "-")}`
    : "";

  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 app-sidebar ${isCollapsed ? "is-collapsed" : ""} ${isMobile ? "is-mobile" : ""}`}
      >
        {!isMobile && (
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom app-sidebar-header">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-shield-alt text-white fs-4"></i>
              {!isCollapsed && (
                <span className="text-white fw-bold fs-5">FraudWatch</span>
              )}
            </div>
            <button
              className="btn btn-sm text-white app-sidebar-toggle"
              onClick={onToggle}
            >
              <i
                className={`fas fa-chevron-${isCollapsed ? "right" : "left"}`}
              ></i>
            </button>
          </div>
        )}

        <div className="flex-grow-1 py-3">
          {/* User profile */}
          {isCollapsed ? (
            <div
              className="user-profile-card user-profile-card--collapsed mx-auto mb-3"
              title={profile.full_name}
            >
              <div className="user-avatar">{initials || "?"}</div>
              <span className="status-dot" aria-hidden="true" />
            </div>
          ) : (
            <div className="user-profile-card mx-2 mb-3">
              <div className="user-avatar">{initials || "?"}</div>
              <div className="user-profile-details">
                <p className="user-name">{profile?.full_name || '?'}</p>
                <span
                  className={`role-badge d-inline-flex align-items-center gap-1 ${roleClass}`}
                >
                  <i className="fas fa-shield-halved" aria-hidden="true" />
                  {displayRole}
                </span>
              </div>
              <span
                className="status-dot"
                title="Online"
                aria-label="Online"
              />
            </div>
          )}

          {/* Nav Menu */}
          <ul className="nav nav-pills flex-column mb-auto px-2">
            {/* General and team_member menu begins */}
            {/* Dashboard */}
            <li className="nav-item mb-2">
              <NavLink
                to="/dashboard"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
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
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
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
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
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
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
                }
              >
                <i className="fas fa-list-alt"></i>
                {!isCollapsed && <span>All Reports</span>}
              </NavLink>
            </li>

            {/* All Reports - Comp
            <li className="nav-item mb-2">
              <NavLink
                to="/all-reports-comp"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
                }
              >
                <i className="fas fa-list-alt"></i>
                {!isCollapsed && <span>All Reports Comp</span>}
              </NavLink>
            </li> */}

            {/* Assigned Reports */}
            {/* {role === "supervisor" && ( */}
            <li className="nav-item mb-2">
              <NavLink
                to="/assigned-reports"
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
                }
              >
                <i className="fas fa-list-alt"></i>
                {!isCollapsed && <span>Assigned Reports</span>}
              </NavLink>
            </li>
            {/* )} */}
            {/* General and team_member menu ends */}
            {profile?.role === "admin" && (
              <li className="nav-item mb-2">
                <NavLink
                  to="/all-reports"
                  onClick={() => isMobile && onClose()}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-3 app-sidebar-link ${isActive ? "active" : "text-white-50"}`
                  }
                >
                  <i className="fas fa-list-alt"></i>
                  {!isCollapsed && <span>Roles Configuration</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Logout */}
        <div className="border-top p-3 app-sidebar-footer">
          {/* <button
            className="btn w-100 d-flex align-items-center gap-3 text-white-50 app-logout-btn"
            // onClick={handleLogout}
            onClick={handleShowModal}
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Logout</span>}
          </button> */}

          <button
            type="button"
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 app-logout-btn"
            onClick={() => setModalShow(true)}
            aria-label="Log out"
          >
            <i className="fas fa-sign-out-alt" aria-hidden="true" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {isMobile && !isCollapsed && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 app-sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <LogoutModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default Sidebar;
