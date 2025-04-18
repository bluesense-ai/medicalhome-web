import AutoLogout from "./helpers/AutoLogout";
import ProtectedRouteAdmin from "./helpers/protectedRouteAdmin";

import AccessCodeAdmin from "../pages/Admin/AccessCodeAdmin";
import AddProviderPage from "../pages/Admin/AddEditProvider/AddProvider";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import BotStatus from "../pages/Admin/BotStatus/BotStatus";
import EditProviderPage from "../pages/Admin/AddEditProvider/EditProviderAdmin";
import ManagePatients from "../pages/Admin/ManagePatients";
import ManageWaitlistAdmin from "../pages/Admin/ManageWaitlist";
import OnboardingAdmin from "../pages/Admin/OnboardingAdmin";
import ProviderListAdmin from "../pages/Admin/ProviderListAdmin";
import WaitlistAdmin from "../pages/Admin/WaitlistAdmin";
import PaymentList from "../pages/Admin/Payments/PaymentsList";

const AdminRoutes = [
  {
    path: "/admin/login",
    element: <OnboardingAdmin />,
  },
  {
    path: "/admin/verify-code",
    element: <AccessCodeAdmin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <AdminDashboard />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/provider-list",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <ProviderListAdmin />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/add-provider",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <AddProviderPage />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/edit-provider/:id",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <EditProviderPage />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/waitlist",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <WaitlistAdmin />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/bot/status",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <BotStatus />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/manage-waitlist",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <ManageWaitlistAdmin />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/manage-patients",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <ManagePatients />
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/admin/payments",
    element: (
      <ProtectedRouteAdmin>
        <AutoLogout>
          <PaymentList />,
        </AutoLogout>
      </ProtectedRouteAdmin>
    ),
  },
];

export default AdminRoutes;
