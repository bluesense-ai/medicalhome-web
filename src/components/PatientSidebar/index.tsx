// import React from "react";
import { useContext, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setPatient } from "../../features/Patient/patientSlice";
import { PatientHomeContext } from "../../pages/Patient/PatientHome";
import { useLocation, useNavigate } from "react-router-dom";

const PatientSidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    scrollToClinicHoursSection,
    scrollToOurPhysiciansRef,
    scrollToContactUsRef,
    bookAppointment,
  } = useContext(PatientHomeContext);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  });
  const handleBookAppointment = () => {
    setIsOpen(false);
    bookAppointment();
  };

  const handleClinicHoursButtonClick = () => {
    setIsOpen(false);
    scrollToClinicHoursSection();
  };

  const handleProviderButtonClick = () => {
    setIsOpen(false);
    scrollToOurPhysiciansRef();
  };

  const handleContactUsButtonClick = () => {
    setIsOpen(false);
    scrollToContactUsRef();
  };

  const handleLogOut = () => {
    dispatch(
      setPatient({
        isAuthenticated: false,
      })
    );
  };

  const navigate = useNavigate();

  const patient = useSelector(
    (state: {
      patient: {
        provider: any;
      };
    }) => state.patient
  );

  return (
    <div
      className={`bottom-0 lg:left-0 lg:h-[calc(100%-86px)] lg:z-30 w-[100%] fixed overflow-y-auto transition-transform duration-300 lg:shadow lg:flex lg:pt-[4px] lg:pb-[4px] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Need to use map to create buttons automatically */}
      <div className="lg:flex h-full lg:flex-col space-y-[20px] items-center lg:bg-[#F2F8FF] justify-between py-28 w-[25%]">
        <div className="lg:flex lg:flex-col lg:px-5 space-y-[20px] justify-center">
          {patient.provider ? (
            <button
              onClick={
                location.pathname.includes("/patient-home")
                  ? handleBookAppointment
                  : () =>
                      navigate("/patient-home", {
                        state: { bookAppointment: true },
                      })
              }
              className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center lg:cursor-pointer"
            >
              <img src="/Icons/event.svg" />
              <p className="lg:text-center lg:text-[#016c9d] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                Book Appointment
              </p>
            </button>
          ) : (
            <button
              onClick={
                location.pathname.includes("/patient-home")
                  ? handleContactUsButtonClick
                  : () =>
                      navigate("/patient-home", {
                        state: { scrollToContactUsRef: true },
                      })
              }
              className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center"
            >
              <img src="/Icons/add_location.svg" />
              <p className="lg:text-center lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
                All clinics
              </p>
            </button>
          )}
          <button
            onClick={
              location.pathname.includes("/patient-home")
                ? handleClinicHoursButtonClick
                : () =>
                    navigate("/patient-home", {
                      state: { scrollToClinicHoursSection: true },
                    })
            }
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center lg:cursor-pointer"
          >
            <img src="/Icons/schedule.svg" />
            <p className="lg:text-center lg:text-[#016c9d] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
              Clinic hours
            </p>
          </button>
          <button
            onClick={
              location.pathname.includes("/patient-home")
                ? handleProviderButtonClick
                : () =>
                    navigate("/patient-home", {
                      state: { scrollToOurPhysiciansRef: true },
                    })
            }
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center lg:cursor-pointer"
          >
            <img src="/Icons/Stethoscope.svg" />
            <p className="lg:text-center lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              {patient.provider ? "Your providers" : "Our providers"}
            </p>
          </button>
          <button
            onClick={
              location.pathname.includes("/patient-home")
                ? handleContactUsButtonClick
                : () =>
                    navigate("/patient-home", {
                      state: { scrollToContactUsRef: true },
                    })
            }
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center"
          >
            <img src="/Icons/alternate_email.svg" />
            <p className="lg:text-center lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Contact us
            </p>
          </button>
        </div>
        <div className="flex flex-col space-y-[20px]">
          <button className="lg:p-2 lg:bg-none lg:border-none items-center lg:rounded-lg lg:gap-2 lg:flex lg:cursor-not-allowed">
            <img src="/Icons/notifications.svg" alt="" />
            <p className="lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Notifications
            </p>
          </button>
          <button
            onClick={() =>
              navigate("/patient-settings/patient-help-and-support")
            }
            className="lg:p-2 lg:bg-none lg:border-none items-center lg:rounded-lg lg:gap-2 lg:flex lg:cursor-pointer"
          >
            <img src="/Icons/contact_support.svg" alt="" />
            <p className="lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Help & Support
            </p>
          </button>
          <button
            onClick={handleLogOut}
            className="lg:p-2 lg:bg-none lg:border-none items-center lg:rounded-lg lg:gap-2 lg:flex lg:cursor-pointer"
          >
            <img src="/Icons/LogOutIcon.svg" alt="" />
            <p className="text-[#a30e0e] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Log out
            </p>
          </button>
        </div>
      </div>
      <div
        translate="no"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[75%] h-full blur-sm backdrop-blur-sm"
      ></div>
    </div>
  );
};

export default PatientSidebar;
