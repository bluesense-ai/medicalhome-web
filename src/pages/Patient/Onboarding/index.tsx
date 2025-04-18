import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { useNavigate } from "react-router-dom";

import { createContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setPatient } from "../../../features/Patient/patientSlice";

import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import TogglePatient from "../../../components/TogglePatient";
import axiosInstance from "../../../axios/axiosInstance";

export const SelectedUserContextNew = createContext<{
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
}>({ selectedUser: "", setSelectedUser: () => {} });

const Onboarding = () => {
  const [selectedUser, setSelectedUser] = useState("Patient");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const schema = yup
    .object()
    .shape({
      healthCardNumber: yup.string().required("Health Card Number is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (selectedUser === "Provider") {
    navigate("/onboarding/provider-login");
  }

  // For loader
  // const waitFor = (timeout: number) => {
  //   return new Promise((resolve) => setTimeout(resolve, timeout));
  // };

  const registerWithMask = useHookFormMask(register);

  const isFirstTimeUser = (isPatientRegistered: boolean) => {
    if (isPatientRegistered) {
      return false;
    } else {
      return true;
    }
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

  const onSubmit = async (data: { healthCardNumber: string }) => {
    console.log("Parent log");
    try {
      // setIsLoading(true);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_PATIENT_HEALTHCARD_ENDPOINT}/${
          data.healthCardNumber
        }`
      );
      // setIsLoading(false);
      console.log("test");
      if (response.status === 200) {
        console.log("Patient exists");
        dispatch(
          setPatient({
            patientID: response.data.id,
            healthCardNumber: data.healthCardNumber,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            emailAddress: response.data.email_address,
            mobileNumber: response.data.phone_number,
            clinic: response.data.clinic,
            address: response.data.address,
            isAuthenticated: false,
            isRegistered: response.data.registered,
            dateOfBirth: response.data.date_of_birth,
            sex: response.data.sex,
            firstTimeUser: isFirstTimeUser(response.data.registered),
          })
        );
      }
      navigate("status");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      // Patient doesn't exist
      if (error.status === 404 || error.response?.status === 404) {
        console.log("This was 404 error");
        console.log(error);
        dispatch(
          setPatient({
            patientID: undefined,
            healthCardNumber: data.healthCardNumber,
            firstName: undefined,
            lastName: undefined,
            emailAddress: undefined,
            mobileNumber: undefined,
            address: undefined,
            clinic: undefined,
            isAuthenticated: false,
            isRegistered: undefined,
            dateOfBirth: undefined,
            sex: undefined,
            firstTimeUser: true,
          })
        );
        navigate("status");
        // Any other error
      } else {
        console.log(error);
        // console.log(`Trying to get status ${error.response.status}`);
        console.log("This was another error");
        // setIsLoading(false);
      }
    }
    console.log("This is another test");
    // navigate("/onboarding/patient-status");
  };

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <SelectedUserContextNew.Provider
        value={{ selectedUser, setSelectedUser }}
      >
        <div className="h-full w-full bg-healthcard-onboarding-background-image bg-cover bg-no-repeat bg-center flex">
          <AuthenticationEmptyNavbar />
          <div className="absolute top-[16%] right-[3%] z-10">
            <TogglePatient />
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
          {/* Form Container */}
          <div className="m-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:flex"
            >
              <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Health Card
                </label>
                <p className="text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
                  We use your health card number to find your information in our
                  system
                </p>
                <input
                  placeholder="Enter your health card number"
                  className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                  {...registerWithMask("healthCardNumber", ["999999999"])}
                />
                {errors.healthCardNumber?.message && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.healthCardNumber?.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
              >
                <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  Next
                </p>
                <img src="/Icons/WhiteRightArrow.svg" />
              </button>
            </form>
          </div>
        </div>
      </SelectedUserContextNew.Provider>
    </>
  );
};
//
export default Onboarding;
