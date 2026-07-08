import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthLoading from "../components/AuthLoading";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
