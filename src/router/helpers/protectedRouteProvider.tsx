import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

const ProtectedRouteProvider = ({ children }: { children: ReactNode }) => {
  // This format is the way to get the patient state from global store
  const provider = useSelector(
    (state: { provider: { isAuthenticated: string } }) => state.provider
  );

  console.log(`From Protected route: ${provider.isAuthenticated}`);

  if (!provider.isAuthenticated) {
    const currentUrl = location.href; 
    if (currentUrl.includes("/consult?id=")) {
        const redirectUrl = encodeURIComponent(currentUrl);
        window.location.href = `${import.meta.env.VITE_APP_URL}/onboarding/provider-login?redirect=${redirectUrl}`;
      } else {
        return <Navigate to="/" replace />;
    }
}


  return children;
};

export default ProtectedRouteProvider;
