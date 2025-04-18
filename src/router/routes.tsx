// // Dependencies
// import { Navigate, Outlet, Route } from "react-router-dom"; // Components
// import App from "../../App";
// // import { PatientSettingsRoutes } from "./PatientSettingsRoutes.js";

// import Error from "../pages/Errors";

// // Patient Screens
// import Onboarding from "../pages/Patient/Onboarding";
// import PatientRegister from "../pages/Patient/PatientRegister";
// import PatientStatus from "../pages/Patient/PatientStatus";
// import VerificationMethodPatient from "../pages/Patient/VerificationMethodPatient";
// import AccessCodePatient from "../pages/Patient/AccessCodePatient";
// import PatientHome from "../pages/Patient/PatientHome";

// // Provider Screens
// import OnboardingProvider from "../pages/Provider/OnboardingProvider";
// import AccessCodeProvider from "../pages/Provider/AccessCodeProvider";
// import ProviderDashboard from "../pages/Provider/ProviderDashboard";
// import ConsultPatient from "../pages/Provider/ConsultPatient";
// import ConsultHistory from "../pages/Provider/ConsultHistory/ConsultHistory";
// import ProviderProfile from "../pages/Provider/ProviderProfile";

// // Route Helpers
// import ProtectedRouteProvider from "./helpers/protectedRouteProvider";
// import ProtectedAuthRoutePatient from "./helpers/protectedAuthRoutePatient";
// import ProtectedRouteLandingScreen from "./helpers/protectedRouteLandingScreen";

// import Playground from "../../Playground";
// import OnboardingAdmin from "../pages/Admin/OnboardingAdmin";
// import AccessCodeAdmin from "../pages/Admin/AccessCodeAdmin";
// import AdminDashboard from "../pages/Admin/AdminDashboard/index";
// import ProviderListAdmin from "../pages/Admin/ProviderListAdmin";
// import AddProviderPage from "../pages/Admin/AddProvider";
// import EditProviderPage from "../pages/Admin/EditProviderAdmin";
// import WaitlistAdmin from "../pages/Admin/WaitlistAdmin";
// import ManageWaitlistAdmin from "../pages/Admin/ManageWaitlist";
// import ManagePatients from "../pages/Admin/ManagePatients";
// import AutoLogout from "./AutoLogout";
// import PatientHelpAndSupport from "../pages/Patient/PatientHelpAndSupport";
// import PatientProfile from "../pages/Patient/PatientProfile";
// import BotStatus from "../pages/Admin/BotStatus/BotStatus";
// import ProviderHelpAndSupport from "../pages/Provider/ProviderHelpAndSupport";

// const AppRoutes = () => (
//   <App>
//     <Route path="/">
//       <Route index element={<Onboarding />} />
//       <Route path="/onboarding/patient-login" element={<Onboarding />} />
//       <Route
//         path="/onboarding/provider-login"
//         element={<OnboardingProvider />}
//       />
//       {/* Will need to add protected route down the line */}
//       <Route path="/access-code-patient" element={<AccessCodePatient />} />
//       {/*  */}
//       <Route path="/access-code-provider" element={<AccessCodeProvider />} />
//       <Route
//         path="/onboarding/patient-status"
//         element={
//           <ProtectedAuthRoutePatient>
//             <PatientStatus />
//           </ProtectedAuthRoutePatient>
//         }
//       />
//       <Route
//         path="/patient-register"
//         element={
//           <ProtectedAuthRoutePatient>
//             <PatientRegister />
//           </ProtectedAuthRoutePatient>
//         }
//       />
//       <Route
//         path="/verify"
//         element={
//           <ProtectedAuthRoutePatient>
//             <VerificationMethodPatient />
//           </ProtectedAuthRoutePatient>
//         }
//       />
//       <Route
//         path="/patient-home"
//         element={
//           <ProtectedRouteLandingScreen>
//             <AutoLogout>
//               <PatientHome />
//             </AutoLogout>
//           </ProtectedRouteLandingScreen>
//         }
//       />

//       <Route
//         path="/patient-settings"
//         element={
//           <ProtectedRouteLandingScreen>
//             <AutoLogout>
//               <Outlet />
//             </AutoLogout>
//           </ProtectedRouteLandingScreen>
//         }
//       >
//         <Route index element={<Navigate to="patient-profile" replace />} />
//         <Route path="patient-profile" element={<PatientProfile />} />
//         <Route
//           path="patient-help-and-support"
//           element={<PatientHelpAndSupport />}
//         />
//       </Route>

//       <Route
//         path="/provider-dashboard"
//         element={
//           <ProtectedRouteProvider>
//             <AutoLogout>
//               <ProviderDashboard />
//             </AutoLogout>
//           </ProtectedRouteProvider>
//         }
//       />
//       <Route
//         path="/consult"
//         element={
//           <ProtectedRouteProvider>
//             <AutoLogout>
//               <ConsultPatient />
//             </AutoLogout>
//           </ProtectedRouteProvider>
//         }
//       />
//       <Route
//         path="/consult-history"
//         element={
//           <ProtectedRouteProvider>
//             <AutoLogout>
//               <ConsultHistory />
//             </AutoLogout>
//           </ProtectedRouteProvider>
//         }
//       />

//       <Route
//         path="/provider-settings"
//         element={
//           <ProtectedRouteProvider>
//             <AutoLogout>
//               <Outlet />
//             </AutoLogout>
//           </ProtectedRouteProvider>
//         }
//       >
//         <Route index element={<Navigate to="provider-profile" replace />} />
//         <Route path="provider-profile" element={<ProviderProfile />} />
//         <Route
//           path="provider-help-and-support"
//           element={<ProviderHelpAndSupport />}
//         />
//       </Route>

//       {/* New Admin Routes */}
//       <Route path="/admin/login" element={<OnboardingAdmin />} />
//       <Route path="/admin/verify-code" element={<AccessCodeAdmin />} />
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       <Route path="/admin/provider-list" element={<ProviderListAdmin />} />
//       <Route path="/admin/add-provider" element={<AddProviderPage />} />
//       <Route path="/edit-provider/:id" element={<EditProviderPage />} />
//       <Route path="/admin/waitlist" element={<WaitlistAdmin />} />
//       <Route path="/admin/bot/status" element={<BotStatus />} />
//       <Route path="/admin/manage-waitlist" element={<ManageWaitlistAdmin />} />
//       <Route path="/admin/manage-patients" element={<ManagePatients />} />
//       <Route path="*" element={<Error />} />
//     </Route>
//     <Route path="/playground" element={<Playground />} />
//   </App>
// );
// export default AppRoutes;
