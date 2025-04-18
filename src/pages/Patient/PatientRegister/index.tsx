import { useNavigate } from "react-router-dom";

import AuthenticationNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import Status from "./components/Status";
import { createContext, useEffect, useState } from "react";
import { SelectField } from "../../../components/Common/CustomFormFields";

import InputMask from "react-input-mask";

// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import { useForm } from "react-hook-form";
// import { useHookFormMask } from "use-mask-input";

// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

import { useSelector, useDispatch } from "react-redux";
import { setPatient } from "../../../features/Patient/patientSlice";
// import NewClinicDropdownButton from "./components/NewClinicDropdownButton";
import SexDropdownButton from "./components/SexDropdownButton";
import { toast } from "react-toastify";

import axiosInstance from "../../../axios/axiosInstance";
import Loader from "../../../components/Loader";
import NewClinicDropdownButton from "./components/NewClinicDropdownButton";

export const UserDetailsContext = createContext<{
  selectedClinic: string;
  setSelectedClinic: React.Dispatch<React.SetStateAction<string>>;
  selectedSex: string;
  setSelectedSex: React.Dispatch<React.SetStateAction<string>>;
}>({
  selectedClinic: "",
  setSelectedClinic: () => {},
  selectedSex: "",
  setSelectedSex: () => {},
});

const PatientRegister = () => {
  // const [currentForm, setCurrentForm] = useState("patient-details-form");
  const [currentForm, setCurrentForm] = useState("health-card-form");
  const navigate = useNavigate();
  const [collectedUserInfo, setCollectedUserInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // This format is the way to get the patient state from global store
  const patient = useSelector(
    (state: {
      patient: {
        healthCardNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        sex: string;
        emailAddress: string;
        mobileNumber: string;
        methodOfVerification: string;
        isRegistered: boolean;
        address: string;
        preferred_provider_sex: string;
      };
    }) => state.patient
  );

  // Step 1: Declare state for each input field
  const [firstName, setFirstName] = useState(
    patient.firstName ? patient.firstName : ""
  );
  const [lastName, setLastName] = useState(
    patient.lastName ? patient.lastName : ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    patient.dateOfBirth ? patient.dateOfBirth : ""
  );
  const [mobileNumber, setMobileNumber] = useState(
    patient.mobileNumber ? patient.mobileNumber : ""
  );
  const [emailAddress, setEmailAddress] = useState(
    patient.emailAddress ? patient.emailAddress : ""
  );
  const [address, setAddress] = useState(
    patient.address ? patient.address : ""
  );
  const [preferred_provider_sex, setPreferred_provider_sex] = useState(
    patient.preferred_provider_sex ? patient.preferred_provider_sex : ""
  );


  const [selectedClinicId, setSelectedClinicId] = useState("");

  const [isFirstNameFieldEditable, setIsFirstNameFieldEditable] =
    useState(false);
  const [isAddressFieldEditable, setIsAddressFieldEditable] = useState(false);
  const [isLastNameFieldEditable, setIsLastNameFieldEditable] = useState(false);
  const [isDateOfBirthFieldEditable, setIsDateOfBirthFieldEditable] =
    useState(false);
  const [isSexFieldEditable, setIsSexFieldEditable] = useState(false);
  const [isMobileNumberFieldEditable, setIsMobileNumberFieldEditable] =
    useState(false);
  const [isEmailAddressFieldEditable, setIsEmailAddressFieldEditable] =
    useState(false);

  // Step 2: Handle onChange for each field
  const handleFirstNameChange = (event: { target: { value: string } }) =>
    setFirstName(event.target.value);
  const handleLastNameChange = (event: { target: { value: string } }) =>
    setLastName(event.target.value);
  const handleAddressChange = (event: { target: { value: string } }) =>
    setAddress(event.target.value);

  const handleDateOfBirthChange = (event: { target: { value: string } }) =>
    setDateOfBirth(event.target.value);
  const handleMobileNumberChange = (event: { target: { value: string } }) =>
    setMobileNumber(event.target.value);
  const handleEmailAddressChange = (event: { target: { value: string } }) =>
    setEmailAddress(event.target.value);

  const handlePreferredProviderSexChange = (event: { target: { value: string } }) =>{
    setPreferred_provider_sex(event.target.value);

  }
  const { handleSubmit } = useForm({});

  const dispatch = useDispatch();

  // For loader
  const waitFor = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await waitFor(2000);
      setIsLoading(false);
    };
    load();
    // If patient first name is empty set all those fields to be true
    if (!patient.firstName) {
      console.log("First Name field is empty");
      setIsAddressFieldEditable(true);
      setIsFirstNameFieldEditable(true);
      setIsLastNameFieldEditable(true);
      setIsDateOfBirthFieldEditable(true);
      setIsSexFieldEditable(true);
      setIsMobileNumberFieldEditable(true);
      setIsEmailAddressFieldEditable(true);
    } else if (!patient.address) {
      setIsAddressFieldEditable(true);
    }
    setPreferred_provider_sex(patient.preferred_provider_sex);
  }, [patient.address, patient.firstName]);

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

  // Need to refactor to better handle sequence of forms if possible
  const healthCardFormHandleSubmit = () => {
    if (!selectedClinicId) {
      alert("Select a clinic");
    } else {
      setCollectedUserInfo({
        healthCardNumber: patient.healthCardNumber,
        preferredClinicId: selectedClinicId,
      });
      setCurrentForm("patient-details-form");
    }
  };

  const patientDetailsFormHandleSubmit = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    console.log(collectedUserInfo);
    console.log("Hello");
    if (isSexFieldEditable && selectedSex === "Choose Sex") {
      alert("Select a Sex");
      return 0;
    } else {
      setCollectedUserInfo({
        ...collectedUserInfo,
        firstName: isFirstNameFieldEditable ? firstName : patient.firstName,
        lastName: isLastNameFieldEditable ? lastName : patient.lastName,
        dateOfBirth: isDateOfBirthFieldEditable
          ? dateOfBirth
          : patient.dateOfBirth,
        sex: isSexFieldEditable ? selectedSex : patient.sex,
        address: isAddressFieldEditable ? address : patient.address,
        preferred_provider_sex: preferred_provider_sex,
      });
      setCurrentForm("contact-details-form");
    }
    return 0;
  };

  const contactDetailsFormHandleSubmit = async () => {
    console.log(collectedUserInfo);
    setCollectedUserInfo({
      ...collectedUserInfo,
      mobileNumber: isMobileNumberFieldEditable
        ? mobileNumber
        : patient.mobileNumber,
      emailAddress: isEmailAddressFieldEditable
        ? emailAddress
        : patient.emailAddress,
    });
    setCurrentForm("verification-method-form");
  };

  const verificationMethodFormHandleSubmit = async () => {
    try {
      console.log(collectedUserInfo);
      const response = await axiosInstance.post(
        import.meta.env.VITE_PATIENT_REGISTER_ENDPOINT,
        {
          ...collectedUserInfo,
          otpChannel: selectedVerifyMethod,
        }
      );
      console.log(response);

      if (response) {
        dispatch(
          setPatient({
            patientID: response.data.patientId,
            ...collectedUserInfo,
            methodOfVerification: selectedVerifyMethod,
            providerId: response.data.provider_Id,
            isAuthenticated: false,
            isRegistered: true,
            firstTimeUser: true,
          })
        );
        // console.log(`This is the response ${response.data.re}`);
        // return 0;
        navigate(`/onboarding-patient/access-code-patient`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("issue");
      console.log(`This is the collected user Info ${collectedUserInfo}`);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const [selectedVerifyMethod, setSelectedVerifyMethod] = useState("sms");
  const [selectedClinic, setSelectedClinic] = useState("Choose Clinic");
  const [selectedSex, setSelectedSex] = useState("Choose Sex");

  return (
    <>
      {isLoading && <Loader />}
      <UserDetailsContext.Provider
        value={{
          selectedClinic,
          setSelectedClinic,
          selectedSex,
          setSelectedSex,
        }}
      >
        <div className="lg:w-full lg:h-full lg:flex mt-[60px] lg:flex-col lg:gap-[20px] lg:bg-verification-method-screen-background lg:bg-cover lg:bg-center lg:bg-no-repeat lg:justify-center lg:items-center lg:-z-10">
          <AuthenticationNavbar />
          {currentForm === "health-card-form" && (
            <>
              <form className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:inline-flex">
                <h6 className="text-[#004f62] m-0 h-[32px] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                  Register
                </h6>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Health Card Number
                  </label>
                  <input
                    placeholder="Enter your Health Card"
                    readOnly={patient.healthCardNumber ? true : false}
                    defaultValue={patient.healthCardNumber}
                    className={`self-stretch px-4 py-3 h-[44px] bg-${
                      patient.healthCardNumber ? "[#f2f8ff]" : "white"
                    } rounded-lg border border-[#b1b1b1] ${
                      patient.healthCardNumber ? "text-[#247401]" : ""
                    } justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] ${
                      patient.healthCardNumber ? "border-0" : ""
                    } placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                  />
                </div>
                <div className="self-stretch h-[69px] flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Choose clinic
                  </label>
                  <NewClinicDropdownButton
                    onSelectedClinicIdChange={setSelectedClinicId}
                  />
                </div>
                <button
                  type="button"
                  onClick={healthCardFormHandleSubmit}
                  className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
                >
                  <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                    Next
                  </p>
                  <div className="lg:bg-arrow-component lg:h-4 lg:w-4 lg:mb-[1px]"></div>
                </button>
              </form>
              <Status />
            </>
          )}
          {currentForm === "patient-details-form" && (
            <>
              <form
                onSubmit={patientDetailsFormHandleSubmit}
                className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:inline-flex"
              >
                <div className="w-full justify-between flex">
                  <h6 className="text-[#004f62] m-0 h-[32px] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                    Register
                  </h6>
                  <p className="text-[#004f62]/70 text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
                    1/2
                  </p>
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    First Name
                  </label>
                  {isFirstNameFieldEditable ? (
                    <input
                      required={true}
                      value={firstName}
                      onChange={handleFirstNameChange}
                      readOnly={false}
                      placeholder="Enter your First Name"
                      className={`self-stretch h-[44px] px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        required={true}
                        disabled
                        value={patient.firstName}
                        onChange={handleFirstNameChange}
                        readOnly={true}
                        placeholder="Enter your First Name"
                        className={`grow shrink basis-0 px-4 py-3 bg-[#f2f8ff] text-[#247401] rounded-lg border-0 border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                      />
                      <a
                        onClick={() => {
                          setIsFirstNameFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Last Name
                  </label>
                  {isLastNameFieldEditable ? (
                    <input
                      required={true}
                      value={lastName}
                      onChange={handleLastNameChange}
                      readOnly={false}
                      placeholder="Enter your Last Name"
                      className={`self-stretch h-[44px] px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        required={true}
                        disabled
                        defaultValue={
                          patient.lastName ? patient.lastName : lastName
                        }
                        value={patient.lastName ? patient.lastName : lastName}
                        onChange={handleLastNameChange}
                        readOnly={patient.lastName ? true : false}
                        placeholder="Enter your Last Name"
                        className={`grow shrink basis-0 px-4 py-3 bg-${
                          patient.lastName ? "[#f2f8ff]" : "white"
                        } ${patient.lastName ? "text-[#247401]" : ""} ${
                          patient.lastName ? "border-0" : ""
                        } rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                      />
                      <a
                        onClick={() => {
                          setIsLastNameFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Date of birth
                  </label>
                  {isDateOfBirthFieldEditable ? (
                    <input
                      required={true}
                      value={dateOfBirth}
                      onChange={handleDateOfBirthChange}
                      readOnly={false}
                      type="date"
                      placeholder="DD/MM/YYYY"
                      className={`w-full px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight appearance-none`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        required={true}
                        disabled
                        value={patient.dateOfBirth}
                        onChange={handleDateOfBirthChange}
                        readOnly={true}
                        type="date"
                        placeholder="DD/MM/YYYY"
                        className={`w-full px-4 py-3 h-[44px] bg-${
                          patient.dateOfBirth ? "[#f2f8ff]" : "white"
                        } ${patient.dateOfBirth ? "text-[#247401]" : ""} ${
                          patient.dateOfBirth ? "border-0" : ""
                        } rounded-lg border border-[#b1b1b1] text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight appearance-none`}
                      />
                      <a
                        onClick={() => {
                          setIsDateOfBirthFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <div className="self-stretch h-[69px] flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Sex
                  </label>
                  {isSexFieldEditable ? (
                    <SexDropdownButton />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        required={true}
                        disabled
                        defaultValue={patient.sex ? patient.sex : selectedSex}
                        value={patient.sex ? patient.sex : selectedSex}
                        readOnly={patient.sex ? true : false}
                        placeholder="Enter your Sex"
                        className={`w-full px-4 py-3 h-[44px] bg-${
                          patient.sex ? "[#f2f8ff]" : "white"
                        } ${patient.sex ? "text-[#000000]" : ""} ${
                          patient.sex ? "border-0" : ""
                        } rounded-lg border border-[#b1b1b1] text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight appearance-none`}
                      />
                      <a
                        onClick={() => {
                          setIsSexFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Address
                  </label>
                  <p className="text-xs text-[#757575] font-roboto">
                    *123 Maple Street, Toronto, ON M5H 2N2, Canada
                  </p>
                  {isAddressFieldEditable ? (
                    <input
                      required={true}
                      value={address}
                      onChange={handleAddressChange}
                      readOnly={false}
                      placeholder="Enter your Address"
                      className={`self-stretch h-[44px] px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        required={true}
                        disabled
                        defaultValue={
                          patient.address ? patient.address : address
                        }
                        value={patient.address ? patient.address : address}
                        onChange={handleAddressChange}
                        readOnly={patient.address ? true : false}
                        placeholder="Enter your Address"
                        className={`grow shrink basis-0 px-4 py-3 bg-${
                          patient.address ? "[#f2f8ff]" : "white"
                        } ${patient.address ? "text-[#247401]" : ""} ${
                          patient.address ? "border-0" : ""
                        } rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                      />
                      <a
                        onClick={() => {
                          setIsAddressFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                 
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Request for a provider of a specific sex
                  </label>
                  <p className="text-[14px] text-[#757575] font-roboto">
                    if you rather a provider of an specific sex, let us know by selecting your preference.
                  </p>
                    <SelectField
                      name="preferred_provider_sex"
                      label="Sex"
                      selectedValue={preferred_provider_sex}
                      onChange={handlePreferredProviderSexChange}
                      showLabel={false}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                </div>
                <button
                  type="submit"
                  className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
                >
                  <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                    Next
                  </p>
                  <div className="lg:bg-arrow-component lg:h-4 lg:w-4 lg:mb-[1px]"></div>
                </button>
              </form>
              <Status />
            </>
          )}
          {currentForm === "contact-details-form" && (
            <>
              <form
                onSubmit={contactDetailsFormHandleSubmit}
                className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:inline-flex"
              >
                <div className="w-full justify-between flex">
                  <h6 className="text-[#004f62] m-0 h-[32px] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                    Register
                  </h6>
                  <p className="text-[#004f62]/70 text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
                    2/2
                  </p>
                </div>
                <div className="self-stretch h-[69px] flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Phone Number
                  </label>
                  {isMobileNumberFieldEditable ? (
                    <InputMask
                      mask="+1 999 999 9999" // Phone number mask
                      value={mobileNumber}
                      required={true}
                      onChange={handleMobileNumberChange}
                      readOnly={false}
                      placeholder="Enter your phone number"
                      className={`self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <InputMask
                        mask="+1 999 999 9999" // Phone number mask
                        value={patient.mobileNumber}
                        disabled
                        required={true}
                        readOnly={true}
                        placeholder="Enter your phone number"
                        className={`w-full px-4 py-3 h-[44px] bg-[#f2f8ff]
                       text-[#247401] rounded-lg border-0 border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                      />
                      <a
                        onClick={() => {
                          setIsMobileNumberFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <div className="self-stretch h-[69px] flex-col justify-start items-start gap-2 flex">
                  <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Email
                  </label>
                  {isEmailAddressFieldEditable ? (
                    <input
                      value={emailAddress}
                      // defaultValue={patient.emailAddress ? patient.emailAddress : ""}
                      onChange={handleEmailAddressChange}
                      readOnly={false}
                      placeholder="Enter your email address"
                      className={`self-stretch px-4 py-3 h-[44px] bg-white text-black rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                    />
                  ) : (
                    <div className="self-stretch h-[44px] pr-4 bg-[#f2f8ff] rounded-lg border border-[#f2f8ff] justify-start items-center inline-flex">
                      <input
                        value={patient.emailAddress}
                        onChange={handleEmailAddressChange}
                        readOnly={true}
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 h-[44px] bg-[#f2f8ff] text-[#247401] border-0 rounded-lg border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight`}
                      />
                      <a
                        onClick={() => {
                          setIsEmailAddressFieldEditable(true);
                        }}
                        className="text-center text-[#2727e3] text-xs font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      >
                        edit
                      </a>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
                >
                  <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                    Next
                  </p>
                  <div className="lg:bg-arrow-component lg:h-4 lg:w-4 lg:mb-[1px]"></div>
                </button>
              </form>
            </>
          )}
          {currentForm === "verification-method-form" && (
            <>
              <form
                onSubmit={handleSubmit(verificationMethodFormHandleSubmit)}
                className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-center lg:items-start lg:gap-[18px] z-10 lg:inline-flex"
              >
                <h1 className="lg:text-[#004f62] lg:text-xl lg:font-semibold lg:font-['Roboto'] lg:m-0 lg:leading-loose lg:tracking-wider">
                  Verification
                </h1>
                <div className="lg:w-full lg:space-y-[16px]">
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
                        checked={
                          selectedVerifyMethod === "email" ? true : false
                        }
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
                  type="submit"
                  className="lg:self-stretch lg:m-0 lg:basis-0 lg:h-10 lg:p-3 lg:bg-[#016c9d] lg:rounded-lg lg:border lg:border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:flex lg:cursor-pointer"
                >
                  <p className="lg:text-[#f2f8ff] lg:m-0 lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                    Next
                  </p>
                  <div className="lg:bg-arrow-component lg:h-4 lg:w-4 lg:mb-[1px]"></div>
                </button>
              </form>
            </>
          )}
        </div>
      </UserDetailsContext.Provider>
    </>
  );
};

export default PatientRegister;
