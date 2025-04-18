import AdminRoutes from "./AdminRoutes";
import OnboardingRoutes from "./OnboardingRoutes";
import PatientRoutes from "./PatientRoutes";
import ProviderRoutes from "./ProviderRoutes";
// import TestRoutes from "./TestRoutes"

const AppRoutes = [
  ...OnboardingRoutes,
  ...PatientRoutes,
  ...ProviderRoutes,
  ...AdminRoutes,
  // ...TestRoutes,
];

export default AppRoutes;
