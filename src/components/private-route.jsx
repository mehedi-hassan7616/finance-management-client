import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function PrivateRoute({ children }) {
  const { user, loader } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return children;
}
