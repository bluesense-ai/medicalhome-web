import { Navigate, Outlet } from "react-router-dom";
import ConsultHistory from "../pages/Provider/ConsultHistory/ConsultHistory";
import ConsultPatient from "../pages/Provider/ConsultPatient";
import ProviderDashboard from "../pages/Provider/ProviderDashboard";
import AutoLogout from "./helpers/AutoLogout";
import ProtectedRouteProvider from "./helpers/protectedRouteProvider";
import ProviderProfile from "../pages/Provider/ProviderProfile";
import ProviderHelpAndSupport from "../pages/Provider/ProviderHelpAndSupport";
import ProviderBusinessHours from "../pages/Provider/ProviderBusinessHours";
import ChatPage from "../pages/Provider/ProviderDashboard/local/Chatbot/components/ChatPage";

import PatientList from "../pages/Provider/Patient/PatientList";

import TaskList from "../pages/Provider/Task/TaskList";

import ProviderServices from "../pages/Provider/ProviderServices";
import AddServicePage from "../pages/Provider/AddEditService/AddService";
import EditServicePage from "../pages/Provider/AddEditService/EditService";

const ProviderRoutes = [
  {
    path: "/provider-dashboard",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <ProviderDashboard />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <ChatPage />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <TaskList />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/patient-database",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <PatientList />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/provider-services",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <ProviderServices />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/add-service",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <AddServicePage />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/edit-service/:id",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <EditServicePage />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/consult",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <ConsultPatient />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/consult-history",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <ConsultHistory />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
  },
  {
    path: "/provider-settings",
    element: (
      <ProtectedRouteProvider>
        <AutoLogout>
          <Outlet />
        </AutoLogout>
      </ProtectedRouteProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="provider-profile" replace />,
      },
      {
        path: "provider-profile",
        element: <ProviderProfile />,
      },
      {
        path: "provider-help-and-support",
        element: <ProviderHelpAndSupport />,
      },
      {
        path: "provider-business-hours",
        element: <ProviderBusinessHours />,
      },
    ],
  },
];

export default ProviderRoutes;
