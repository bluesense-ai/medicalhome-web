import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProvider } from "../../../features/Provider/providerSlice";
import { useEffect } from "react";
import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import axiosInstance from "../../../axios/axiosInstance";

const AccessCodeProvider = () => {
  const provider = useSelector(
    (state: {
      provider: {
        emailAddress: string;
        mobileNumber: string;
        username: string;
        methodOfVerification: string;
      };
    }) => state.provider
  );
  const dispatch = useDispatch();
  const location = useLocation();

  // Function to parse the query string
  const getRedirectLink = (search: any) => {
    const params = new URLSearchParams(search);
    return params.get("redirect");
  };

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      // Mark as reloaded
      localStorage.setItem("hasReloaded", "true");
      // Reload the page once
      window.location.reload();
    }

    // Clean up the reload flag on unmount, if needed
    return () => {
      localStorage.removeItem("hasReloaded");
    };
  }, []);

  const maskValue = (value: string, type: "sms" | "email"): string => {
    if (!value) return "";

    if (type === "sms") {
      // Keep first 3 digits visible, mask the middle, and show last 2 digits
      return value.replace(
        /^(\+?\d{3})\d*(\d{2})$/,
        (_, start, end) =>
          `${start}${"*".repeat(
            value.length - start.length - end.length
          )}${end}`
      );
    } else {
      // Mask email (show first 3 letters, domain, and last letter of username)
      const [username, domain] = value.split("@");
      if (!domain) return value;

      const visiblePart = username.slice(0, 3);
      const maskedUsername =
        username.length > 4
          ? `${visiblePart}${"*".repeat(username.length - 4)}`
          : `${visiblePart}${"*".repeat(Math.max(0, username.length - 3))}`;

      return `${maskedUsername}@${domain}`;
    }
  };

  const navigate = useNavigate();
  // Will also need to put in some filed validation

  const schema = yup
    .object()
    .shape({
      accessCode: yup.string().required("Access Code is a Required Field"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // To recieve data from a url into a component just use the useParamas hook

  // Need to figure out a way to not route
  const onSubmit = async (data: { accessCode: string }) => {
    try {
      const response = await axiosInstance.post(
        // Update endpoint for deployment and store in .env file
        `${
          import.meta.env.VITE_BACKEND_URL
        }/auth/verify-verification-code-provider`,
        {
          username: provider.username,
          otpChannel: provider.methodOfVerification,
          accessCode: data.accessCode,
        }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.access_token);
        dispatch(
          setProvider({
            providerID: response.data.data.user.id,
            username: provider.username,
            firstName: response.data.data.user.first_name,
            middleName: response.data.data.user.middle_name,
            lastName: response.data.data.user.last_name,
            mobileNumber: response.data.data.user.phone_number,
            emailAddress: response.data.data.user.email_address,
            clinic: response.data.data.user.clinic,
            isAuthenticated: true,
            ms_calendar_id: response.data.data.user.ms_calendar_id,
            picture: response.data.data.user.picture,
          })
        );
        const redirectLink = getRedirectLink(location.search);
        if (redirectLink) {
          window.location.href = decodeURIComponent(redirectLink);
        } else {
          navigate("/provider-dashboard");
        }
      } else {
        console.log("Invalid credentials");
        alert("Invalid OTP!!!");
      }
    } catch (error) {
      console.log("Invalid credentials");
      alert("Invalid OTP!!!");
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full lg:bg-patient-login-background bg-cover bg-no-repeat bg-center flex">
      <AuthenticationEmptyNavbar />
      {/* Header container */}
      <div className="m-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-auto w-[503px] p-6 bg-white rounded-lg border-2 border-[#33c213] flex-col justify-start items-start gap-[15px] inline-flex"
        >
          <h1 className="text-[#247401] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
            Log in
          </h1>
          <div className="self-stretch h-[10%] flex-col justify-start items-start gap-3 flex">
            <label className="self-stretch text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
              Access Code
            </label>
            <p className="self-stretch text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
              {`Code sent to: ${
                provider.methodOfVerification === "sms"
                  ? maskValue(provider.mobileNumber, "sms")
                  : maskValue(provider.emailAddress, "email")
              }`}
            </p>
            <input
              // type="text"
              {...register("accessCode")}
              placeholder="Enter your Access Code"
              maxLength={8}
              className="self-stretch px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex grow shrink basis-0 text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
            />
            {errors.accessCode?.message && (
              <p className="text-red-600 text-sm mt-2">
                {errors.accessCode?.message}
              </p>
            )}
          </div>
          <button className="self-stretch p-3 bg-[#33c213] mt-auto h-[38px] rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex cursor-ponter">
            <p className="text-[#f2f8ff] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Log in
            </p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeProvider;
