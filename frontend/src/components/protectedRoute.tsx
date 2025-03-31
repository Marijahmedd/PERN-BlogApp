import { ReactNode } from "react";
import { useStore } from "../store/myStore"; // Adjust path as needed
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/register" replace />
  );
};

export default ProtectedRoute;
