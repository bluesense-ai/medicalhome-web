import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import OnboardingAdminForm from "./components/OnboadingAdminFoam";
import axiosInstance from "../../../axios/axiosInstance";
import { setAdmin } from "../../../features/Admin/AdminSlice";

const OnboardingAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: {
    username: string;
    verificationMethod: "sms" | "email";
  }) => {
    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_ADMIN_LOGIN_ENDPOINT,
        {
          username: data.username,
          otpChannel: data.verificationMethod,
        }
      );

      if (response.status === 200) {
        dispatch(
          setAdmin({
            adminID: response.data.adminId,
            first_name: "",
            last_name: "",
            username: data.username,
            phone_number: response.data.phone_number,
            email: response.data.email_address,
            isAuthenticated: false,
            methodOfVerification: data.verificationMethod,
          })
        );
        navigate(`/admin/verify-code`);
      }
    } catch (error) {
      console.log("Invalid credentials", error);
      alert("Invalid Credentials!!!");
    }
  };

  return (
    <div className="h-full w-full bg-provider-onboarding-background-image bg-cover bg-no-repeat bg-center min-h-screen flex flex-col md:flex-row p-4 justify-center items-center">
      <AuthenticationEmptyNavbar />

      <div className="flex flex-col md:flex-row justify-around items-center w-full md:space-x-10">
        <div className="text-center mb-6 md:mb-0">
          <h1 className="text-[#004f62] text-4xl md:text-6xl font-medium leading-snug">
            PACMC
          </h1>
          <h2 className="text-[#33c213] text-2xl md:text-[32px] font-normal leading-tight">
            Medical Home
          </h2>
        </div>

        <div className="w-full max-w-md lg:max-w-lg">
          <OnboardingAdminForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingAdmin;
