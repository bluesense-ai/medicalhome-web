import React, { useState } from "react";
import ProviderList from "./components/ProviderList/ProviderList";
import QuickSettings from "./components/QuickSettings/QuickSettings";
import AdminHeader from "../../../components/AdminHeader/Adminheader";

const ProviderLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <AdminHeader
        userInitial="a"
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />

      <div
        className={`flex flex-col lg:flex-row ${
          isSidebarOpen ? "blur-sm ml-[30%]" : ""
        }`}
      >
        <div className="w-full lg:w-80 order-1 lg:order-2 mb-6 lg:mb-0">
          <QuickSettings />
        </div>

        <div className="px-4 lg:px-0 w-full lg:w-3/4 order-2 lg:order-1">
          <ProviderList />
        </div>
      </div>
    </>
  );
};

export default ProviderLayout;
