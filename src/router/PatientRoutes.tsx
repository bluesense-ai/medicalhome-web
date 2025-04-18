import { Navigate, Outlet } from "react-router-dom";
import PatientHome from "../pages/Patient/PatientHome";
import AutoLogout from "./helpers/AutoLogout";
import ProtectedRouteLandingScreen from "./helpers/protectedRouteLandingScreen";
import PatientProfile from "../pages/Patient/PatientProfile";
import PatientHelpAndSupport from "../pages/Patient/PatientHelpAndSupport";

const PatientRoutes = [
  {
    path: "/patient-home",
    element: (
      <ProtectedRouteLandingScreen>
        <AutoLogout>
          <PatientHome />
        </AutoLogout>
      </ProtectedRouteLandingScreen>
    ),
  },
  {
    path: "/patient-settings",
    element: (
      <ProtectedRouteLandingScreen>
        <AutoLogout>
          <Outlet />
        </AutoLogout>
      </ProtectedRouteLandingScreen>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="patient-profile" replace />,
      },
      {
        path: "patient-profile",
        element: <PatientProfile />,
      },
      {
        path: "patient-help-and-support",
        element: <PatientHelpAndSupport />,
      },
    ],
  },
];

export default PatientRoutes;
