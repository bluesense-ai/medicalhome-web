import React, { useState } from "react";
import AddProviderForm from "./components/AddServiceForm";
import ProviderHeader from "../../../../components/ProviderListHeader/ProviderListHeader";
import ProviderNavbar from "../../../../components/ProviderNavbar";

const AddServicePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen ">
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <div
        className={`flex-col items-center justify-start mt-36 gap-[20px] w-full h-full ${isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
          }`}
      >


        <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader title="New Service" showAddButton={false} textAlignment="center" />
          </div>
          <div className="bg-white rounded-lg  overflow-hidden">
            <div className="p-2 sm:p-2 md:p-1">
              <AddProviderForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
