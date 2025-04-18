import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import styles from "./BookingModals.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface CustomEvent {
  id: string;
  title: string;
  serviceId: string;
  start: Date;
  end: Date;
  staffMemberIds?: string[];
  ms_id: string;
  healthCardNumber?: string;
}

interface EventPopupProps {
  isOpen: boolean;
  onRequestClose: () => void;
  dropdownCoordinates: {
    xPosition: number;
    yPosition: number;
  };
  selectedEvent: CustomEvent;
  staff: any[];
  services: any[];
  expandBooking: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({
  isOpen,
  onRequestClose,
  // dropdownCoordinates,
  selectedEvent,
  staff,
  services,
  expandBooking,
}) => {
  const navigate = useNavigate();
  const provider = useSelector(
    (state: {
      provider: {
        firstName: string;
        lastName: string;
        ms_calendar_id: string;
        picture: string;
      };
    }) => state.provider
  );

  if (!selectedEvent) {
    return null;
  }

  const handleConsultClick = () => {
    if (selectedEvent) {
      const service = services.find((s) => s.id === selectedEvent.serviceId);
      const serviceName = service ? service.name : "";
      const updatedEvent = {
        ...selectedEvent,
        serviceName,
        id:"",
        ms_booking_id: selectedEvent.id,
      };
      //update id for #ms_to_local conversion
      navigate("/consult", { state: { selectedEvent: updatedEvent } });
    } else {
      console.error("No event selected");
    }
  };

  const handleHistoryClick = () => {
    if (selectedEvent) {
      if (selectedEvent.healthCardNumber) {
        navigate(
          `/consult-history?patient_hcn=${selectedEvent.healthCardNumber}`
        );
      } else {
        toast.error("No Health Card Number found in Booking");
      }
    } else {
      console.error("No event selected");
    }
  };
  const getServiceName = (serviceId: string) => {
    const service = services.find((s: any) => s.id === serviceId);
    return service ? service.name.replace("-", " - ") : "";
  };
  const formatForDateTimeForPopup = (startDate: Date, endDate: Date) => {
    return `${startDate.toLocaleDateString()} - ${startDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}  -  ${endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleCloseDropdown = () => {
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Options"
      style={{
        content: {
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        },
      }}
      className="w-[535px] h-auto p-[20px] bg-[#f2f8ff] rounded-[11px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
    >
      <div className="" role="document">
        <div className={styles.modalContent}>
          <div className={styles.popupModalHeader}>
            <div>
              <h4 className="text-[#247401] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                {getServiceName(selectedEvent.serviceId)}
              </h4>
              <div className="text-[#004f62] text-sm font-semibold font-['Roboto'] leading-7 tracking-tight">
                {formatForDateTimeForPopup(
                  selectedEvent.start,
                  selectedEvent.end
                )}
              </div>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={handleCloseDropdown}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className={styles.popupModalBody}>
            <div className="h-full w-full flex gap-2 items-center">
              <p style={{ margin: "5px", marginLeft: "10px" }}>
                <i className="fa-solid fa-user"></i> &nbsp;
              </p>
              {selectedEvent.title}
            </div>

            <div className={styles.staffContainer}>
              {selectedEvent.staffMemberIds?.map((staffId: any) => {
                const staffMember = staff.find(
                  (member: any) => member.id === staffId
                );
                return staffMember ? (
                  <div
                    key={provider.ms_calendar_id}
                    className="w-full h-full justify-start gap-2 rounded-full flex items-center"
                  >
                    <img
                      className="rounded-full w-8 h-8 mr-2"
                      src={
                        provider.picture?.includes("http")
                          ? provider.picture
                          : `${import.meta.env.VITE_CDN_URL}/${
                              import.meta.env.VITE_BUCKET_NAME
                            }/${provider.picture}`
                      }
                    />
                    <p className="text-center text-black text-lg font-normal font-['Roboto'] leading-tight tracking-tight">
                      {`Dr. ${provider.lastName[0].toUpperCase()}${provider.lastName.substring(
                        1
                      )}` || ""}
                    </p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex justify-between items-center mx-4 my-3">
            <button
              className="flex text-[#016c9d] gap-2 text-sm font-semibold font-['Roboto'] leading-[14px]"
              onClick={expandBooking}
            >
              <i className="fa-solid fa-pencil-alt"></i> Edit
            </button>
            <button
              className="flex items-center gap-2 text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]"
              onClick={handleConsultClick}
            >
              <img src="/Icons/medical_services.svg" />
              Visit
            </button>
            <button
              className="flex items-center gap-2 text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px]"
              onClick={handleHistoryClick}
            >
              <img src="/Icons/note_add.svg" />
              History
            </button>
            <button className="flex border-[1px] rounded-md border-gray-300 p-3 text-gray-400 gap-2 text-sm font-semibold font-['Roboto'] leading-[14px] cursor-not-allowed">
              <i className="fa-solid fa-phone"></i> Contact
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventPopup;
