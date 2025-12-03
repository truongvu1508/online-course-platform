import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { AuthContext } from "../contexts/auth.context";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, appLoading } = useContext(AuthContext);

  if (appLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
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
