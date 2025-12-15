import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import CircularProgress from "@mui/material/CircularProgress";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, appLoading } = useContext(AuthContext);

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!user.id) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
