// import React from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setProvider } from "../../features/Provider/providerSlice";

const ProviderSidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/provider-dashboard");
  };

  const handleVisitsClick = () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes("patient_hcn")) {
      window.location.href = "/consult-history";
    } else {
      navigate("/consult-history");
    }
  };


  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(
      setProvider({
        isAuthenticated: false,
      })
    );
  };

  return (
    <div
      className={`bottom-0 lg:left-0 lg:h-[calc(100%-90px)] lg:z-10 w-[100%] fixed overflow-y-auto transition-transform duration-300 lg:shadow lg:flex lg:pt-[4px] lg:pb-[4px] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Need to use map to create buttons automatically */}
      <div className="lg:flex h-full lg:flex-col space-y-[20px] items-center lg:bg-[#F2F8FF] justify-between py-28 w-[25%]">
        <div className="lg:flex lg:flex-col space-y-[20px]">
          <button
            onClick={handleDashboardClick}
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center lg:cursor-pointer"
          >
            <img src="/Icons/space_dashboard.svg" alt="" />
            <p className="lg:text-center lg:text-[#016c9d] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
              Dashboard
            </p>
          </button>
          <button
            onClick={handleVisitsClick}
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center lg:cursor-pointer"
          >
            <img src="/Icons/event_note.svg" alt="" />
            <p className="lg:text-center lg:text-[#016c9d] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
              Visits Workflow
            </p>
          </button>
          <button onClick={()=>navigate("/patient-database")} className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center ">
            <img src="/Icons/group.svg" alt="" />
            <p className="lg:text-center text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Patients Database
            </p>
          </button>
          <button onClick={()=>navigate("/provider-services")} className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:items-center ">
            <img src="/Icons/group.svg" alt="" />
            <p className="lg:text-center text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Provider Services
            </p>
          </button>
        </div>
        <div className="flex flex-col space-y-[20px]">
          {/* <button className="lg:p-2 lg:bg-none lg:border-none items-center lg:rounded-lg lg:gap-2 lg:flex lg:cursor-not-allowed">
            <img src="/Icons/NotificationIcon.svg" alt="" />
            <p className="lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Notifications
            </p>
          </button> */}
          <button
            onClick={() =>
              navigate("/provider-settings/provider-help-and-support")
            }
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg items-center lg:gap-2 lg:flex lg:cursor-pointer"
          >
            <img src="/Icons/contact_support.svg" alt="" />
            <p className="lg:text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Help & Support
            </p>
          </button>
          <button
            onClick={handleLogOut}
            className="lg:p-2 lg:bg-none lg:border-none lg:rounded-lg lg:gap-2 lg:flex lg:cursor-pointer"
          >
            <img src="/Icons/LogOutIcon.svg" alt="" />
            <p className="text-[#a30e0e] text-sm font-semibold font-['Roboto'] leading-[14px]">
              Log out
            </p>
          </button>
        </div>
      </div>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[75%] h-full"
      ></div>
    </div>
  );
};

export default ProviderSidebar;
