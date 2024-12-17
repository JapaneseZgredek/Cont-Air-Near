import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyRoles } from "../services/api";

const ProtectedRoute = ({ requiredRoles, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        await verifyRoles(requiredRoles);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Access denied or authentication error:", error.message);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [requiredRoles]);

  if (isAuthorized === null) {
    return <div>Loading...</div>; //dodac 403
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;