import { useEffect, useState } from "react";
import MicrosoftCalendar from "./microsoft/Calendar";
import LocalCalendar from "./local/Calendar";
import ProviderNavbar from "../../../components/ProviderNavbar";
import { useSelector } from "react-redux";
import LocationModal from "./common/components/LocationModal";
import ChatButton from "./local/Chatbot/components/ChatButton";

const ProviderDashboard = () => {
  const provider = useSelector(
    (state: {
      provider: {
        clinic: string;
        ms_calendar_id: string;
      };
    }) => state.provider
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    if (!provider.clinic) {
      setIsLocationModalOpen(true);
    }
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

  const handleSubmit = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />

      <div className="h-full w-full flex items-center justify-center bg-white relative">
        {/* Modal */}
        {isLocationModalOpen && (
          <div className="flex justify-center items-center z-20 absolute top-0 left-0 w-full h-full  bg-opacity-30">
            <LocationModal handleModalSubmit={handleSubmit} />
          </div>
        )}

        {/* Main Content */}
        <div
          className={`bg-white h-[95%] w-[95%] ${
            isSidebarOpen ? " blur ml-[40%]" : "ml-0"
          } ${
            isLocationModalOpen ? "blur-sm" : ""
          } rounded-md p-2 transition-all`}
        >
          {provider.ms_calendar_id ? <MicrosoftCalendar /> : <LocalCalendar />}
        </div>
        
        {/* Chatbot Button - Fixed to the right side */}
        <div className="fixed right-4 bottom-4 z-10">
          <ChatButton />
        </div>
      </div>
    </>
  );
};

export default ProviderDashboard;
