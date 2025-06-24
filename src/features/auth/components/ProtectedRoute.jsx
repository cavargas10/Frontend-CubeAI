import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { BrandedSpinner } from "../../../components/ui/BrandedSpinner";

const Loading = () => (
    <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-principal z-50">
        <BrandedSpinner size="lg" />
    </div>
);

export const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthContext();
  const location = useLocation(); 

  if (authStatus === 'authenticating' || authStatus === 'loading_data') {
    return <Loading />;
  }
  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (authStatus === 'unverified') {
    return <Navigate to="/verify-email" replace />;
  }
  if (authStatus === 'authenticated') {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};