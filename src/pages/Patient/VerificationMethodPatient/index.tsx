import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setPatient } from "../../../features/Patient/patientSlice";

import AuthenticationNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import axiosInstance from "../../../axios/axiosInstance";

const VerificationMethodPatient = () => {
  const patient = useSelector(
    (state: {
      patient: {
        patientID: string;
        healthCardNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        sex: string;
        emailAddress: string;
        mobileNumber: string;
      };
    }) => state.patient
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Exectuing 1");
    try {
      console.log("Is Executing 2");
      const response = await axiosInstance.post(
        import.meta.env.VITE_PATIENT_LOGIN_REQUEST_OTP_ENDPOINT,
        {
          healthCardNumber: patient.healthCardNumber,
          otpChannel: selectedVerifyMethod,
        }
      );
      if (response.data.success) {
        console.log("Is Executing 3");
        dispatch(
          setPatient({
            ...patient,
            patientID: response.data.patientId,
            methodOfVerification: selectedVerifyMethod,
            isAuthenticated: false,
          })
        );
        navigate(`/onboarding-patient/access-code-patient`);
      }
    } catch (error) {
      console.log("Invalid credentials");
      alert("Invalid Credentials!!!");
      console.log(error);
    }
    console.log("Is Executing 4");
  };
  const [selectedVerifyMethod, setSelectedVerifyMethod] = useState("sms");

  return (
    <div className="lg:w-full lg:h-full lg:flex lg:bg-verification-method-screen-background lg:bg-cover lg:bg-top lg:bg-no-repeat lg:justify-center lg:items-center lg:-z-10">
      <AuthenticationNavbar />
      <div className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-center lg:items-start lg:gap-[18px] z-10 lg:inline-flex">
        <h1 className="lg:text-[#004f62] lg:text-xl lg:font-semibold lg:font-['Roboto'] lg:m-0 lg:leading-loose lg:tracking-wider">
          Verification
        </h1>
        <div className="lg:w-full  lg:space-y-[16px]">
          <p className="lg:font-roboto lg:text-[#1e1e1e] lg:text-sm lg:font-normal lg:leading-[16.80px] lg:m-0 lg:tracking-wider">
            How would you like to verify your account?
          </p>
          <div className="lg:flex lg:w-[70%] lg:justify-between">
            <div className="lg:flex lg:w-[50%] lg:space-x-3 lg:h-[10%]">
              <input
                type="radio"
                checked={selectedVerifyMethod === "sms" ? true : false}
                onClick={() => setSelectedVerifyMethod("sms")}
                className="lg:m-0 accent-[#004f62]"
              />
              <p className="lg:text-[#004f62] lg:text-sm lg:font-normal lg:font-['Roboto'] lg:leading-[16.80px] lg:tracking-wider">
                Phone Number
              </p>
            </div>
            <div className="lg:flex lg:w-[50%] lg:space-x-3 lg:h-[10%]">
              <input
                type="radio"
                checked={selectedVerifyMethod === "email" ? true : false}
                onClick={() => setSelectedVerifyMethod("email")}
                className="lg:m-0 accent-[#004f62]"
              />
              <p className="lg:text-[#004f62] lg:text-sm lg:font-normal lg:font-['Roboto'] lg:leading-[16.80px] lg:tracking-wider">
                Email Address
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
        >
          <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
            Next
          </p>
          <div className="lg:bg-arrow-component lg:h-4 lg:w-4 lg:mb-[1px]"></div>
        </button>
      </div>
    </div>
  );
};

export default VerificationMethodPatient;
