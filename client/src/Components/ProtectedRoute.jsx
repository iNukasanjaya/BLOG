import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role");
  return userRole === role ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
