import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setProvider } from "../../../features/Provider/providerSlice";
import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import ToggleProvider from "../../../components/ToggleProvider";
import axiosInstance from "../../../axios/axiosInstance";

export const SelectedProviderContextNew = createContext<{
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
}>({ selectedUser: "", setSelectedUser: () => {} });

const OnboardingProvider = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState("Provider");
  const location = useLocation();

  // Function to parse the query string
  const getRedirectLink = (search: any) => {
    const params = new URLSearchParams(search);
    const redirectValue = params.get("redirect");
    if (redirectValue === null) {
      return null;
    }
    return encodeURIComponent(redirectValue);
  };

  // This format is the way to get the patient state from global store
  const provider = useSelector((state: { provider: object }) => state.provider);
  const dispatch = useDispatch();

  const [selectedVerifyMethod, setSelectedVerifyMethod] = useState("sms");

  const schema = yup
    .object()
    .shape({
      username: yup.string().required("Username is Required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log("Provider state updated:", provider);
  }, [provider]);

  if (selectedUser === "Patient") {
    navigate("/");
  }

  // edit this to send the request in the right format
  const onSubmit = async (data: {
    email_address: string;
    phone_number: string;
    username: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        import.meta.env.VITE_PROVIDER_LOGIN_ENDPOINT,
        {
          username: data.username,
          otpChannel: selectedVerifyMethod,
        }
      );
      setIsLoading(false);

      if (response.status === 200) {
        dispatch(
          setProvider({
            username: data.username,
            mobileNumber: response.data.phone_number,
            emailAddress: response.data.email_address,
            clinic: "",
            methodOfVerification: selectedVerifyMethod,
            isAuthenticated: false,
          })
        );
        const redirectLink = getRedirectLink(location.search);
        const url = redirectLink
          ? `/access-code-provider?redirect=${redirectLink}`
          : `/access-code-provider`;
        navigate(url);
      }
    } catch (error) {
      console.log("Invalid credentials");
      console.log(error);
      setIsLoading(false);

      alert("Invalid Credentials!!!");
    }
  };

  return (
    <SelectedProviderContextNew.Provider
      value={{ selectedUser, setSelectedUser }}
    >
      <div className="h-full w-full bg-provider-onboarding-background-image bg-cover bg-no-repeat bg-center flex">
        <AuthenticationEmptyNavbar />
        <div className="absolute top-[16%] right-[3%] z-10">
          <ToggleProvider />
        </div>
        {/* Header container */}
        <div className="flex flex-col m-auto">
          <h1 className="text-[#004f62] text-6xl font-medium font-['Roboto'] leading-[61px]">
            PACMC
          </h1>
          <h2 className="text-[#33c213] text-[32px] font-normal font-inter leading-[38.40px]">
            Medical Home
          </h2>
        </div>
        <div className="m-auto">
          <form
            // @ts-ignore
            onSubmit={handleSubmit(onSubmit)}
            method="post"
            className="w-[503px] h-auto p-6 bg-white rounded-lg border-2 border-[#33c213] flex-col justify-start items-start gap-[15px] inline-flex"
          >
            <h1 className="text-[#247401] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
              Log in
            </h1>
            <div className="w-full">
              <p className="font-roboto text-[#1e1e1e] text-sm font-normal mb-5 leading-[16.80px] tracking-wide">
                How would you like to verify your account?
              </p>
              <div className="flex w-[70%] justify-between">
                <div className="flex w-[50%] space-x-3 h-[10%]">
                  <input
                    type="radio"
                    className="accent-[#247401]"
                    checked={selectedVerifyMethod === "sms" ? true : false}
                    onClick={() => setSelectedVerifyMethod("sms")}
                  />
                  <p className=" text-[#004f62] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Phone Number
                  </p>
                </div>
                <div className="flex w-[50%] space-x-3 h-[10%]">
                  <input
                    type="radio"
                    className="accent-[#247401]"
                    checked={selectedVerifyMethod === "email" ? true : false}
                    onClick={() => setSelectedVerifyMethod("email")}
                  />
                  <p className="text-[#004f62] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Email Address
                  </p>
                </div>
              </div>
            </div>
            <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
              <label className="self-stretch text-[#1e1e1e] text-sm font-normal mt-2 font-['Roboto'] leading-[16.80px] tracking-wider">
                Username
              </label>
              <input
                placeholder="Enter your Username"
                className="self-stretch px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                {...register("username")}
              />
              {errors.username?.message && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.username?.message}
                </p>
              )}
            </div>
            <div className="self-stretch justify-start items-center gap-4 inline-flex">
              <button
                type="submit"
                disabled={isLoading}
                className={`self-stretch grow shrink basis-0 h-[38px] p-3 rounded-lg border justify-center items-center gap-2 flex ${
                  isLoading
                    ? "bg-[#a5d6a7] border-[#a5d6a7] cursor-not-allowed text-[#d9f2da]"
                    : "bg-[#33c213] border-[#33c213] cursor-pointer text-[#f2f8ff]"
                }`}
              >
                <p className="lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  {isLoading ? "Processing..." : "Next"}
                </p>
                {!isLoading && (
                  <img src="/Icons/WhiteRightArrow.svg" alt="Next" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SelectedProviderContextNew.Provider>
  );
};

export default OnboardingProvider;
