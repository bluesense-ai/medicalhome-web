import { Navigate } from "react-router-dom";
import Onboarding from "../pages/Patient/Onboarding";
import OnboardingProvider from "../pages/Provider/OnboardingProvider";
import AccessCodePatient from "../pages/Patient/AccessCodePatient";
import AccessCodeProvider from "../pages/Provider/AccessCodeProvider";
import ProtectedAuthRoutePatient from "./helpers/protectedAuthRoutePatient";
import PatientStatus from "../pages/Patient/PatientStatus";
import PatientRegister from "../pages/Patient/PatientRegister";
import VerificationMethodPatient from "../pages/Patient/VerificationMethodPatient";

const OnboardingRoutes = [
  {
    path: "/",
    element: <Navigate to="/onboarding-patient" replace />,
  },
  {
    path: "/onboarding-patient",
    children: [
      {
        index: true,
        element: <Onboarding />,
      },
      {
        path: "status",
        element: (
          <ProtectedAuthRoutePatient>
            <PatientStatus />
          </ProtectedAuthRoutePatient>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedAuthRoutePatient>
            <PatientRegister />
          </ProtectedAuthRoutePatient>
        ),
      },
      {
        path: "access-code-patient",
        element: <AccessCodePatient />,
      },
      {
        path: "verify",
        element: (
          <ProtectedAuthRoutePatient>
            <VerificationMethodPatient />
          </ProtectedAuthRoutePatient>
        ),
      },
    ],
  },
  {
    path: "onboarding/provider-login",
    element: <OnboardingProvider />,
  },

  {
    path: "access-code-provider",
    element: <AccessCodeProvider />,
  },
];

export default OnboardingRoutes;
