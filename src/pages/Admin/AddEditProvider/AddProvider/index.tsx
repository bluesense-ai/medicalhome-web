import React, { useState } from "react";
import AdminHeader from "../../../../components/AdminHeader/Adminheader";
import AddProviderForm from "./components/AddProviderForm";
import ProviderHeader from "../../../../components/ProviderListHeader/ProviderListHeader";

const AddProviderPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen ">
      <AdminHeader
        userInitial="A"
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <main
        className={`container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 ${
          isSidebarOpen ? "blur-sm ml-[25%]" : ""
        }`}
      >
        <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader title="New provider" showAddButton={false} />
          </div>
          <div className="bg-white rounded-lg  overflow-hidden">
            <div className="p-2 sm:p-2 md:p-1">
              <AddProviderForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProviderPage;
