import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

const ProtectedRouteAdmin = ({ children }: { children: ReactNode }) => {
  // This format is the way to get the admin state from global store
  const admin = useSelector(
    (state: { admin: { isAuthenticated: boolean } }) => state.admin
  );

  console.log(`From new Protected route: ${admin.isAuthenticated}`);

  if (!admin.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRouteAdmin;
