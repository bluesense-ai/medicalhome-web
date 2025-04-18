import React from "react";
import { Link } from "react-router-dom";

// const navigationItemsWithIcons = [
//   {
//     text: "Notifications",
//     icon: "/Icons/NotificationIcon.svg",
//     link: "#",
//   },
//   { text: "Settings", icon: "/Icons/SettingsIcon.svg", link: "#" },
// ];

const navigationItemsWithoutIcons = [
  {
    text: "Dashboard",
    icon: "/Icons/space_dashboard.svg",
    link: "/admin/dashboard",
  },
  {
    text: "Provider list",
    icon: "/Icons/list.svg",
    link: "/admin/provider-list",
  },
  {
    text: "Waitlist",
    icon: "/Icons/queue.svg",
    link: "/admin/manage-waitlist",
  },
  {
    text: "Payments",
    icon: "/Icons/payment.svg",
    link: "/admin/payments",
  },
  {
    text: "Bot Status",
    icon: "/Icons/smart_toy.svg",
    link: "/admin/bot/status",
  },
];

interface SideBarMenuProps {
  isOpen: boolean;
  onLogout?: () => void;
}

const SideBarMenu: React.FC<SideBarMenuProps> = ({ isOpen, onLogout }) => {
  return (
    <div
      id="sideBarMenu"
      className={`fixed top-[70px] left-0 w-[300px] h-[calc(100vh-56px)] bg-[#F2F8FF] p-5 z-50 flex flex-col items-center overflow-y-auto transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mt-[100px] md:mt-[100px]">
        <div className="flex flex-col items-start gap-10 w-full">
          {navigationItemsWithoutIcons.map((item) => (
            <Link
              to={item.link}
              key={item.text}
              className="flex items-center gap-2"
            >
              {item.icon && (
                <img src={item.icon} alt={item.text} className="h-5 w-5" />
              )}
              <span className="text-[#3C73A7] font-semibold text-[14px] leading-[16px] text-left">
                {item.text}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation items with icons */}
      <div className="flex flex-col gap-10 items-start mx-auto mt-auto w-fit mb-10">
        {/* {navigationItemsWithIcons.map((item) => (
          <Link
            to={item.link}
            key={item.text}
            className="flex items-center gap-2"
          >
            <img src={item.icon} alt={item.text} className="h-5 w-5" />
            <span
              className={`font-semibold text-[16px] ${
                item.text === "Log out" ? "text-[#E24444]" : "text-[#3C73A7]"
              }`}
            >
              {item.text}
            </span>
          </Link>
        ))} */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onLogout} // Trigger logout function
        >
          <img src="/Icons/LogOutIcon.svg" alt="Log out" />
          <span className="font-semibold text-[#E24444] text-[16px]">
            Log out
          </span>
        </div>
      </div>
    </div>
  );
};

export default SideBarMenu;
