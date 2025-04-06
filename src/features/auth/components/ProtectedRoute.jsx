import React from 'react'; 
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const Loading = () => (
    <div className="fixed inset-0 flex justify-center items-center bg-principal z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-morado-gradient"></div>
    </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  const location = useLocation(); 

  if (loadingAuth) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};