import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import AuthLoading from "../components/AuthLoading";

const SESSION_TIMEOUT_MS =
  Number(import.meta.env.VITE_SESSION_LIFETIME) * 60 * 1000;

const ProtectedRoute = ({ children }) => {
  const timeOutRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Inactivity logout — only while authenticated
  useEffect(() => {
    if (!user) return;

    if (!Number.isFinite(SESSION_TIMEOUT_MS) || SESSION_TIMEOUT_MS <= 0) {
      return;
    }

    const logoutUser = async () => {
      await supabase.auth.signOut();
      toast.error("Logged out due to inactivity");
      navigate("/login");
    };

    const resetTimer = () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      timeOutRef.current = setTimeout(logoutUser, SESSION_TIMEOUT_MS);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, navigate]);

  if (loading) {
    return <AuthLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
