import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ setNotFound, children }) => {
  const token = localStorage.getItem("token");
  useEffect(() => {
    setNotFound(true);
  }, []);

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If token is present, render the children (protected component)
  return children;
};

export default ProtectedRoute;
