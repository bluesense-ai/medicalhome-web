import { useSelector } from "react-redux";
import PatientSidebar from "../PatientSidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientNavbar = () => {
  const patient = useSelector(
    (state: {
      patient: {
        firstName: string;
        picture: string;
      };
    }) => state.patient
  );

  const navigate = useNavigate();

  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const toggleSidebar = () => {
    // Using the value from parent
    setIsSidebarOpened((prev: boolean) => !prev);
  };

  return (
    <>
      <header className="lg:top-0 lg:w-full lg:z-10 lg:h-[90px] lg:bg-white fixed lg:shadow lg:flex items-center justify-between lg:pt-[4px] lg:pb-[4px] lg:px-[64px]">
        <div className="flex cursor-pointer" onClick={toggleSidebar}>
          <img
            src={
              isSidebarOpened ? "/Icons/CloseIcon.svg" : "/Icons/MenuIcon.svg"
            }
            alt={isSidebarOpened ? "Close" : "Menu"}
          />
        </div>
        <div
          onClick={() => navigate("/patient-home")}
          className="lg:h-full lg:flex cursor-pointer"
        >
          <img className="h-full w-full" src="/Icons/MedicalHome.svg" />
        </div>
        <div
          onClick={() => navigate("/patient-settings")}
          className="w-9 h-9 bg-[#3b3b3b] rounded-full flex items-center justify-center cursor-pointer"
        >
          {patient.picture ? (
            <img
              className="rounded-full h-full w-full"
              src={`${import.meta.env.VITE_CDN_URL}/${
                import.meta.env.VITE_BUCKET_NAME
              }/${patient.picture}`}
            />
          ) : (
            <span className="text-white text-lg">
              {patient.firstName[0].toUpperCase()}
            </span>
          )}
        </div>
      </header>
      <PatientSidebar isOpen={isSidebarOpened} setIsOpen={setIsSidebarOpened} />
    </>
  );
};

export default PatientNavbar;
