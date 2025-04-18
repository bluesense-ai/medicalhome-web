// import { useState } from "react";
import ProviderSidebar from "../ProviderSidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckValidity from "../Common/CheckValidity/CheckValidity";

const ProviderNavbar = ({
  isSidebarOpened,
  setIsSidebarOpened,
}: {
  isSidebarOpened: boolean;
  setIsSidebarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const provider = useSelector(
    (state: {
      provider: {
        username: string;
        picture: string;
      };
    }) => state.provider
  );

  const toggleSidebar = () => {
    // Using the value from parent
    setIsSidebarOpened((prev: boolean) => !prev);
  };

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/provider-settings");
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
        <div className="lg:h-full lg:flex">
          <img className="h-full w-full" src="/Icons/MedicalHome.svg" />
        </div>
        <button
          onClick={handleProfileClick}
          className="w-9 h-9 bg-[#3b3b3b] rounded-full flex items-center justify-center"
        >
          <img
            className="rounded-full h-full w-full"
            src={
              provider.picture?.includes("http")
                ? provider.picture
                : `${import.meta.env.VITE_CDN_URL}/${
                    import.meta.env.VITE_BUCKET_NAME
                  }/${provider.picture}`
            }
          />
        </button>
      </header>
      <CheckValidity isAdmin={false} />
      <ProviderSidebar
        isOpen={isSidebarOpened}
        setIsOpen={setIsSidebarOpened}
      />
    </>
  );
};

export default ProviderNavbar;
