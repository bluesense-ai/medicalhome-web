import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

const ProtectedRouteLandingScreen = ({ children }: { children: ReactNode }) => {
  // This format is the way to get the patient state from global store
  const patient = useSelector(
    (state: { patient: { isAuthenticated: boolean } }) => state.patient
  );

  console.log(`From new Protected route: ${patient.isAuthenticated}`);

  if (!patient.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRouteLandingScreen;
