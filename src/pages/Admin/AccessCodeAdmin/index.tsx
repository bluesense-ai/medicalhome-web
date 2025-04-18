import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import AccessCodeAdminForm from "./components/AccessCodeAdminForm";
import { useSelector, useDispatch } from "react-redux";
import { setAdmin } from "../../../features/Admin/AdminSlice";
import { RootState } from "../../../store/store";

const AccessCodeAdmin = () => {
  // Use RootState to type the state
  const admin = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }

    return () => {
      localStorage.removeItem("hasReloaded");
    };
  }, []);

  const onSubmit = async (data: { accessCode: string }) => {
    // Check if admin.username and methodOfVerification are set
    if (!admin.username || !admin.methodOfVerification) {
      alert(
        "Admin username or verification method is not set. Please log in again."
      );
      navigate("/admin/verify-code");
      return; // Prevent further execution
    }

    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_ADMIN_ACCESS_CODE_VERIFICATION_ENDPOINT,
        {
          username: admin.username,
          accessCode: data.accessCode,
          otpChannel: admin.methodOfVerification,
        }
      );

      if (response.data.success) {
        console.log("Access Code verified:", response);
        localStorage.setItem("token", response.data.data.access_token);

        // Dispatch Redux action to update admin state
        dispatch(
          setAdmin({
            adminID: response.data.data.id,
            first_name: response.data.data.first_name || "",
            last_name: response.data.data.last_name || "",
            username: response.data.data.username || "",
            phone_number: response.data.data.phone_number || "",
            email: response.data.data.email || "",
            isAuthenticated: true,
            methodOfVerification: admin.methodOfVerification,
          })
        );

        navigate("/admin/dashboard");
      } else {
        alert("Invalid OTP!");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("Invalid access code, please try again.");
      navigate("/admin/verify-code");
    }
  };

  return (
    <div className="h-full w-full bg-patient-login-background bg-cover bg-no-repeat bg-center flex lg:flex-row flex-col justify-center items-center">
      <AuthenticationEmptyNavbar />
      <div className="w-full p-4 flex justify-center">
        <AccessCodeAdminForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default AccessCodeAdmin;
