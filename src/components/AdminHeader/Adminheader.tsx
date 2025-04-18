import React, { useEffect } from "react";
import SideBarMenu from "../SideBarMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../features/Admin/AdminSlice";
import CheckValidity from "../Common/CheckValidity/CheckValidity";

interface AdminHeaderProps {
  userInitial: string;
  isSidebarOpened: boolean;
  setIsSidebarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  userInitial,
  isSidebarOpened,
  setIsSidebarOpened,
}) => {
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpened((prev) => !prev);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sideBarMenu");
      const menuIcon = document.getElementById("menuIcon");
      if (
        sidebar &&
        menuIcon &&
        !menuIcon.contains(event.target as Node) &&
        !sidebar.contains(event.target as Node)
      ) {
        setIsSidebarOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const logoutAdmin = () => {
    // Clear local storage
    dispatch(
      setAdmin({
        isAuthenticated: false,
        adminID: undefined,
        first_name: undefined,
        last_name: undefined,
        username: undefined,
        phone_number: undefined,
        email: undefined,
        methodOfVerification: undefined,
      })
    );
    // localStorage.removeItem("token");
    // localStorage.removeItem("hasReloaded");

    navigate("/admin/login");
  };

  return (
    <>
      <header className="bg-[#FFFFFF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] w-full h-[65px] px-[67px] flex items-center justify-between opacity-100">
        <div
          id="menuIcon"
          className="flex items-center cursor-pointer"
          onClick={toggleSidebar}
        >
          <img
            src={
              isSidebarOpened ? "/Icons/CloseIcon.svg" : "/Icons/MenuIcon.svg"
            }
            alt={isSidebarOpened ? "Close" : "Menu"}
          />
        </div>
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center"
        >
          <img
            src="/img/general/logo.png"
            alt="Logo"
            className="h-14 cursor-pointer"
          />
        </div>
        <div className="flex items-center">
          <div className="w-9 h-9 bg-[#3b3b3b] rounded-full flex items-center justify-center">
            <span className="text-white text-lg">
              {userInitial.toUpperCase()}
            </span>
          </div>
        </div>
      </header>
      <SideBarMenu isOpen={isSidebarOpened} onLogout={logoutAdmin} />
      <CheckValidity />
    </>
  );
};

export default AdminHeader;
