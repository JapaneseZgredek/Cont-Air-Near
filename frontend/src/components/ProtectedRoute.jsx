import { Navigate } from "react-router-dom";
import { verifyRoles } from "../services/api";

const ProtectedRoute = ({ requiredRoles, children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    console.warn("User is not authenticated. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  try {
    verifyRoles(requiredRoles);
    return children;
  } catch (error) {
    console.error("Access denied. Redirecting to unauthorized page.");
    return <Navigate to="/login" />;  //albo zrobic unauthorized ale to bez sensu
  }
};

export default ProtectedRoute;
