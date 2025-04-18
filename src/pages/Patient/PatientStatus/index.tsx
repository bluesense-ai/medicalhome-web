import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthenticationEmptyNavbar from "../../../components/AuthenticationNavbar/AuthenticationEmptyNavbar";
import Loader from "../../../components/Loader";

const PatientStatus = () => {
  // const modalRef = useRef<ModalHandle>(null);
  // const secondModalRef = useRef<ModalHandle>(null);
  const [patientStatus, setPatientStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showWeFoundYouBox, setShowWeFoundYouBox] = useState(false);

  const patient = useSelector(
    (state: { patient: { firstName: string; isRegistered: boolean } }) =>
      state.patient
  );

  // For time till redirect
  const waitFor = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
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

  useEffect(() => {
    async function determineAction() {
      if (patient.isRegistered) {
        setPatientStatus("Full");

        setIsLoading(true);

        await waitFor(2000); // Wait for 2 seconds (2000ms) till navigate to next screen
        setIsLoading(false);
        setShowWeFoundYouBox(true);
        await waitFor(2000);
        navigate("/onboarding-patient/verify");
      } else if (patient.firstName && !patient.isRegistered) {
        setPatientStatus("Partial");
        setIsLoading(true);
        await waitFor(2000); // Wait for 2 seconds (2000ms) till navigate to next screen
        setIsLoading(false);
        setShowWeFoundYouBox(true);
        await waitFor(2000);
        navigate("/onboarding-patient/register");
      } else {
        setPatientStatus("None");
        setIsLoading(false);
      }
    }
    determineAction();
  }, [navigate, patient.firstName, patient.isRegistered]);

  const handleRegisterClick = () => {
    navigate("/onboarding-patient/register");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="h-full w-full bg-patient-status-background-image bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center gap-10 px-10">
      <AuthenticationEmptyNavbar />
      {/* for full */}
      {/* Loading State: PACMC Text and Spinner Side by Side */}
      {isLoading && (
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-[#004f62] text-6xl font-medium font-['Roboto'] leading-[61px]">
              PACMC
            </h1>
            <h2 className="text-[#33c213] text-[32px] font-normal font-inter leading-[38.40px]">
              Medical Home
            </h2>
          </div>
          <Loader showOverlay={false} />
        </div>
      )}

      {/* We Found You Box */}
      {showWeFoundYouBox && patientStatus === "Full" && (
        <div className="flex flex-row items-center justify-center gap-24">
          <div className="w-[312px] h-auto bg-[#f2f8ff] rounded-[28px] flex flex-col justify-start items-center p-6 gap-4">
            <img src="/Icons/SmileIcon.svg" />
            <div className="self-stretch text-center text-[#247401] text-2xl font-normal font-['Roboto'] leading-loose">
              We found you!
            </div>
            <div className="self-stretch text-[#004f62] text-sm font-normal font-['Roboto'] leading-tight tracking-tight">
              We have found your health card number in our system as a current
              patient, now you'll be redirected to the log in screen.
            </div>
          </div>
        </div>
      )}

      {/* We Found You Box: Partial */}
      {showWeFoundYouBox && patientStatus === "Partial" && (
        <div className="flex flex-row items-center justify-center gap-24">
          <div className="w-[312px] h-auto bg-[#f2f8ff] rounded-[28px] flex flex-col justify-start items-center p-6 gap-4">
            <img src="/Icons/SmileIcon.svg" />
            <div className="self-stretch text-center text-[#247401] text-2xl font-normal font-['Roboto'] leading-loose">
              We found you!
            </div>
            <div className="self-stretch text-[#004f62] text-sm font-normal font-['Roboto'] leading-tight tracking-tight">
              We have found your health card number and some existing details,
              but you'll need to register with our system. Now you'll be
              redirected to the Registration screen.
            </div>
          </div>
        </div>
      )}

      {patientStatus === "None" && (
        <div className="w-[312px] h-auto bg-[#f2f8ff] rounded-[28px] flex-col justify-start items-center inline-flex">
          <div className="h-auto px-6 pt-6 flex-col justify-center items-center gap-4 flex">
            <img src="/Icons/AccountIcon.svg" />
            <h1 className="text-center text-[#247401] text-2xl font-normal font-['Roboto'] leading-loose">
              Want to register?
            </h1>
            <p className="text-[#004f62] text-sm font-normal font-['Roboto'] leading-tight tracking-tight">
              Your health card is not in our database. If you are a current
              patient, you should try verifying and introducing your health card
              again. Otherwise, feel free to register!
            </p>
          </div>
          <hr className="w-full border border-[#004f62] mt-[16px]" />
          <div className="flex h-[88px] justify-end w-full">
            <div className="flex w-2/3 justify-center items-center">
              <button
                onClick={handleBackClick}
                className="m-auto h-10 rounded-[100px] justify-center items-center gap-2 inline-flex self-stretch grow shrink basis-0 pl-3 pr-4 py-2.5"
              >
                <img src="/Icons/BlueLeftArrow.svg" />
                <p className="text-[#3499d6] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                  Back
                </p>
              </button>
              <button
                onClick={handleRegisterClick}
                className="m-auto h-10 rounded-[100px] justify-center items-center gap-2 inline-flex self-stretch grow shrink basis-0 pl-3 pr-4 py-2.5"
              >
                <p className="text-[#3499d6] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                  Register
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {isLoading && <Loader showOverlay={false}/>} */}
    </div>
    // </div>
  );
};

export default PatientStatus;
