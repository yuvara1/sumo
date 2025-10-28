import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/auth.js";

const RequireAuth = ({ redirectTo = "/login" }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  return user ? <Outlet /> : <Navigate to={redirectTo} replace state={{ from: location }} />;
};

export default RequireAuth;