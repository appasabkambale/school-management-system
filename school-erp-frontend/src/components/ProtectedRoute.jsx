import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/auth";

const ProtectedRoute = ({ children, role }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
