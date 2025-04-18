import { useNavigate } from "react-router-dom";

import AuthenticationNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useSelector, useDispatch } from "react-redux";
import { setPatient } from "../../../features/Patient/patientSlice";

import { useEffect } from "react";

import axiosInstance from "../../../axios/axiosInstance";

const AccessCodePatient = () => {
  const navigate = useNavigate();

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

  const patient = useSelector(
    (state: {
      patient: {
        patientID: string;
        healthCardNumber: string;
        middleName: string;
        methodOfVerification: string;
        firstName: string;
        lastName: string;
        mobileNumber: string;
        emailAddress: string;
        clinic: string;
        isRegistered: boolean;
        firstTimeUser: boolean;
        address: boolean;
      };
    }) => state.patient
  );
  const dispatch = useDispatch();

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

  // Need to figure out a way to not route
  const onSubmit = async (data: { accessCode: string }) => {
    try {
      const response = await axiosInstance.post(
        // Update endpoint for deployment and store in .env file
        `${import.meta.env.VITE_PATIENT_ACCESSCODE_ENDPOINT}/${
          patient.patientID
        }`,
        {
          accessCode: data.accessCode,
          otpChannel: patient.methodOfVerification,
        }
      );
      console.log(`This is the response: ${response}`);
      // return 0;
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.access_token);
        if (patient.firstName && !patient.isRegistered) {
          // return 0;
          // dispatch(
          //   setPatient({
          //     ...patient,
          //     isAuthenticated: true,
          //   })
          // );
          navigate("/patient-register");
        } else {
          if (response.data.data.provider) {
            // return 0;
            dispatch(
              setPatient({
                patientID: response.data.data.id,
                healthCardNumber: patient.healthCardNumber,
                mobileNumber: response.data.data.phone_number,
                emailAddress: response.data.data.email_address,
                firstName: response.data.data.first_name,
                middleName: response.data.data.middle_name,
                lastName: response.data.data.last_name,
                dateOfBirth: response.data.data.date_of_birth,
                sex: response.data.data.sex,
                isAuthenticated: true,
                providerId: response.data.data.provider.id,
                providerFirstName: response.data.data.provider.first_name,
                providerLastName: response.data.data.provider.last_name,
                providerCalendarId: response.data.data.provider.ms_calendar_id,
                providerEmail: response.data.data.provider.email_address,
                providerPicture: response.data.data.provider.picture,
                firstTimeUser: patient.firstTimeUser,
                preferred_clinic_id: response.data.data.preferred_clinic_id,
                provider: response.data.data.provider,
                picture: response.data.data.picture,
                pronouns: response.data.data.pronouns,
                address: response.data.data.address,
              })
            );
          } else {
            dispatch(
              setPatient({
                patientID: response.data.data.id,
                healthCardNumber: patient.healthCardNumber,
                mobileNumber: response.data.data.phone_number,
                emailAddress: response.data.data.email_address,
                firstName: response.data.data.first_name,
                middleName: response.data.data.middle_name,
                dateOfBirth: response.data.data.date_of_birth,
                sex: response.data.data.sex,
                lastName: response.data.data.last_name,
                isAuthenticated: true,
                providerId: response.data.data.provider_id,
                firstTimeUser: patient.firstTimeUser,
                preferred_clinic_id: response.data.data.preferred_clinic_id,
                picture: response.data.data.picture,
                pronouns: response.data.data.pronouns,
                address: response.data.data.address,
              })
            );
          }
          // console.log("Patient Home worked!");
          navigate("/patient-home");
        }
      } else {
        // console.log("Invalid credentials");
        alert("Invalid OTP!!!");
      }
    } catch (error) {
      // console.log(patient.patientID);
      // console.log(patient.healthCardNumber);
      // console.log(patient.methodOfVerification);
      // console.log(
      //   `${import.meta.env.VITE_PATIENT_ACCESSCODE_ENDPOINT}/${
      //     patient.patientID
      //   }`
      // );
      // console.log("Invalid credentials");
      alert("Invalid OTP!!!");
      // console.log(error);
    }
  };

  return (
    <div
      className={`lg:w-full lg:h-full lg:flex lg:${
        patient.firstName && patient.firstTimeUser
          ? "bg-verification-method-screen-background"
          : "bg-patient-login-background"
      } lg:bg-cover lg:bg-center lg:bg-no-repeat lg:justify-center lg:items-center lg:-z-10`}
    >
      <AuthenticationNavbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:inline-flex"
      >
        <h6 className="text-[#004f62] m-0 h-[32px] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
          {patient.firstName && patient.firstTimeUser
            ? "Verification"
            : "Log in"}
        </h6>
        <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
          {patient.firstName && patient.firstTimeUser && (
            <label className="self-stretch text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
              <label className="self-stretch text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
                {`Code sent to: ${
                  patient.methodOfVerification === "sms"
                    ? maskValue(patient.mobileNumber, "sms")
                    : maskValue(patient.emailAddress, "email")
                }`}
              </label>
            </label>
          )}
          <input
            {...register("accessCode")}
            placeholder="Enter your Access Code"
            className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
          />
          {errors.accessCode?.message && (
            <p className="text-red-600 text-sm mt-2">
              {errors.accessCode?.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="self-stretch shrink basis-0 h-[38px] p-3 bg-[#016c9d] rounded-lg border border-[#016c9d] justify-center items-center gap-2 flex cursor-pointer"
        >
          <p className="text-[#f2f8ff] text-sm font-semibold font-['Roboto'] leading-[14px]">
            {patient.firstName && patient.firstTimeUser ? "Verify" : "Login"}
          </p>
        </button>
      </form>
    </div>
  );
};

export default AccessCodePatient;
