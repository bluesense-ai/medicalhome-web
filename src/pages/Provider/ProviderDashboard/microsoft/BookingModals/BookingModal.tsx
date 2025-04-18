import Modal from "react-modal";
import Select from "react-select";
import styles from "./BookingModals.module.css";
import * as helper from "../Calendar/Helpers/helper";
import { useSelector } from "react-redux";
import ContainerLoader from "../../../../../components/Common/ContainerLoader";
import { isValid } from "../../../../../common/globalVariables";
import { useEffect, useState } from "react";
import { CheckValidityModal } from "../../../../../components/Common/CheckValidity/CheckValidityModal";

interface BookingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  formValues: {
    serviceId: string;
    start: string;
    end: string;
    startTime: string;
    title: string;
    customerEmailAddress?: string;
    customerPhone?: string;
    customerNotes?: string;
    optOutOfCustomerEmail?: boolean;
    isCustomerAllowedToManageBooking?: boolean;
    staffMemberIds?: string[];
    healthCardNumber?: number;
  };
  services: { id: string; name: string }[];
  staff: { id: string; displayName: string }[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleStaffChange: (selectedOptions: any) => void;
  createBooking: () => void;
  updateBooking: () => void;
  selectedEvent: any;
  toggleMoreOptions: () => void;
  showMoreOptions: boolean;
  availableTimeSlots: any[];
  closeModal: () => void;
  openCancellationPopup: () => void;
  loadingAvailability: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onRequestClose,
  formValues,
  services,
  staff,
  handleChange,
  handleStaffChange,
  createBooking,
  updateBooking,
  selectedEvent,
  availableTimeSlots,
  toggleMoreOptions,
  showMoreOptions,
  closeModal,
  openCancellationPopup,
  loadingAvailability,
}) => {
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

  const [validityModelOpen, setValidityModelOpen] = useState(false);

  const checkValidity = () => {
    console.log("checking validity");
    console.log(isValid);
    if (!isValid) {
      setValidityModelOpen(true);
      closeModal();
    }
  };
  useEffect(() => {
    checkValidity();
  }, [isOpen]);

  const validityModelClose = () => {
    console.log("close validity model");
    setValidityModelOpen(false);
  };
  

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Edit Event"
        className="w-auto h-auto p-[20px] bg-[#f2f8ff] rounded-[11px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none"
        overlayClassName={styles.overlay}
       >
        <div className={styles.modalDialog} role="document">
          <div className={styles.modalContent}>
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full items-center">
                <h1 className="text-black text-base font-normal font-['Roboto'] leading-tight tracking-wide">
                  Visit details
                </h1>
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    className={styles.close}
                    onClick={closeModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-start items-center  gap-10">
                <input
                  id="start"
                  type="date"
                  className="w-[221px] h-10 px-4 py-2.5 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                  name="start"
                  value={helper.formatDate(formValues.start)}
                  onChange={handleChange}
                />
                <select
                  id="service"
                  name="service"
                  value={formValues.serviceId}
                  onChange={handleChange}
                  className="h-10 w-[321px] pl-4 pr-3 py-1 bg-white bg-[url('https://www.svgrepo.com/show/80156/down-arrow.svg')] bg-no-repeat bg-[length:14px_14px] bg-[position:calc(100%-14px)_center] rounded-lg border border-[#b1b1b1] text-sm justify-start items-center gap-2 inline-flex appearance-none"
                >
                  <option value="">Select a service</option>
                  {services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <img
                  className="absolute inset-y-0 z-40 right-3 flex items-center pointer-events-none"
                  src="/Icons/ArrowDownIcon.svg"
                />
              </div>
            </div>

            <div className="p-[5px] my-4 flex overflow-y-auto">
              <div className={styles.gridContainer}>
                <div className="flex flex-col">
                  <div className="flex flex-col gap-2 mb-5">
                    <label
                      className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
                      htmlFor="healthCardNumber"
                    >
                      Health Card:
                    </label>
                    <input
                      id="healthCardNumber"
                      type="text"
                      maxLength={9}
                      minLength={9}
                      className="h-11 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                      name="healthCardNumber"
                      value={formValues.healthCardNumber}
                      onChange={handleChange}
                      placeholder="Health Card Number"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <div className="flex items-center mb-1">
                      <h4 className="text-black text-base font-normal font-['Roboto'] leading-tight tracking-wide">
                        Patient Information
                      </h4>
                      <img src="/Icons/EditPencilIcon.svg" />
                    </div>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      className="h-11 w-full px-4 py-3 bg-white disabled:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:text-[#b3b3b3] rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-black text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                      value={formValues.title}
                      onChange={handleChange}
                      placeholder="Patient Name"
                      disabled={selectedEvent}
                    />
                  </div>
                  <div className={`${styles.formGroupRow} ${styles.formGroup}`}>
                    <div className={styles.halfWidth}>
                      <input
                        id="customerPhone"
                        type="tel"
                        name="customerPhone"
                        className="h-11 w-full px-4 py-3 bg-white disabled:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:text-[#b3b3b3] rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-black text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                        value={formValues.customerPhone || ""}
                        onChange={handleChange}
                        placeholder="Phone"
                        disabled={selectedEvent}
                      />
                    </div>
                    <div className={styles.halfWidth}>
                      <input
                        id="customerEmailAddress"
                        type="email"
                        name="customerEmailAddress"
                        className="h-11 w-full px-4 py-3 bg-white disabled:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:text-[#b3b3b3] rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-black text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                        value={formValues.customerEmailAddress || ""}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={selectedEvent}
                      />
                    </div>
                  </div>

                  {showMoreOptions && (
                    <>
                      <div className={styles.formGroup}>
                        <h1 className="text-black text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider mb-2">
                          Patient Notes
                        </h1>
                        <textarea
                          id="customerNotes"
                          name="customerNotes"
                          value={formValues.customerNotes || ""}
                          className="h-2 w-full px-3 py-2 bg-white disabled:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:text-[#b3b3b3] rounded-lg border border-[#b1b1b1] justify-start items-start inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-wider"
                          onChange={handleChange}
                          placeholder="No patient notes have been recorded"
                          disabled={selectedEvent}
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <label className="flex items-center text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                          <input
                            type="checkbox"
                            name="optOutOfCustomerEmail"
                            checked={formValues.optOutOfCustomerEmail || false}
                            onChange={handleChange}
                            className="w-4 h-4 bg-white rounded border border-[#b1b1b1] mr-2"
                          />
                          Don't send customer an email confirmation
                        </label>
                      </div>
                      <div
                        className="mb-4 flex items-center"
                        style={{ display: selectedEvent ? "block" : "none" }}
                      >
                        <label className="flex items-center text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                          <input
                            type="checkbox"
                            name="isCustomerAllowedToManageBooking"
                            checked={
                              formValues.isCustomerAllowedToManageBooking ||
                              false
                            }
                            onChange={handleChange}
                            className="w-4 h-4 bg-white rounded border border-[#b1b1b1] mr-2"
                            disabled
                          />
                          Let customers manage their appointment
                        </label>
                      </div>
                    </>
                  )}
                  <div className={styles.formGroup}>
                    <button
                      type="button"
                      className="text-[#3499d6] text-sm font-normal font-['Roboto'] underline leading-[21px] tracking-tight"
                      onClick={toggleMoreOptions}
                    >
                      {showMoreOptions ? "Show less" : "Show more"}
                    </button>
                  </div>
                </div>

                <div className={styles.rightColumn}>
                  <div className="mb-2">
                    <h4 className={`${styles.heading} hidden`}>Staff</h4>
                    <label
                      className="text-black text-base font-normal font-['Roboto'] leading-tight tracking-wide"
                      htmlFor="staffName"
                    >
                      Assigned Staff:
                    </label>
                    <Select
                      id="staffName"
                      name="staffName"
                      isMulti
                      options={staff?.map((member: any) => ({
                        value: member.id,
                        label: member.displayName,
                      }))}
                      className="hidden"
                      onChange={handleStaffChange}
                    />
                  </div>
                  {formValues.staffMemberIds &&
                    Array.isArray(formValues.staffMemberIds) &&
                    formValues.staffMemberIds.length > 0 && (
                      <div className={styles.staffProfiles}>
                        {formValues.staffMemberIds.map((staffId: any) => {
                          const staffMember = staff.find(
                            (member: any) => member.id === staffId
                          );
                          return staffMember ? (
                            <div
                              key={staffMember.id}
                              className="w-full h-full justify-start gap-2 rounded-full flex my-4 items-center"
                            >
                              <img
                                className="rounded-full w-9 h-9"
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
                    )}

                  <div className="col-span-1">
                    <div className="form-group">
                      <h4 className="text-black text-base font-normal font-['Roboto'] leading-tight tracking-wide mb-5">
                        Available Times:
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full float-right mr-3 mb-2 ${
                            selectedEvent || formValues.startTime
                              ? "block"
                              : "hidden"
                          }`}
                        >
                          {helper.formatTime(formValues.start)}
                        </span>
                      </h4>
                      {loadingAvailability && (
                        <ContainerLoader fontSize="2rem" />
                      )}
                      <div
                        className="grid grid-cols-3 gap-2"
                        style={{ height: "200px", overflowY: "scroll" }}
                      >
                        {availableTimeSlots?.length > 0 ? (
                          availableTimeSlots.map((slot, index) => (
                            <button
                              key={index}
                              className="w-[86px] h-8 p-1 bg-[#212121]/10 rounded-2xl justify-center items-center inline-flex text-black/90 text-sm font-normal font-['Roboto'] leading-tight tracking-wide hover:bg-[#016c9d] hover:text-white"
                              onClick={() => {
                                handleChange({
                                  target: {
                                    name: "startTime",
                                    value: slot.start.toISOString(),
                                  },
                                } as any);
                              }}
                            >
                              {slot.start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </button>
                          ))
                        ) : (
                          <p style={{ width: "120%" }}>
                            {loadingAvailability ? "" : "No available slots"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="absolute right-0 left-0 bottom-0 max-w-none flex w-full justify-end items-center p-[20px] border-t border-black">
              {selectedEvent ? (
                <>
                  <button
                    type="button"
                    className="border-none rounded-md px-5 gap-2 cursor-pointer flex items-center transition-colors duration-300 ease-in-out mr-auto text-[#a30e0e] text-sm font-semibold font-['Roboto'] leading-[14px]"
                    onClick={openCancellationPopup}
                  >
                    <i className="fa-solid fa-calendar-xmark "></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-[#33c213] rounded-lg border border-[#33c213] text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px] p-3 cursor-pointer ml-2 transition-colors duration-300 ease-in-out"
                    onClick={updateBooking}
                  >
                    Update Booking
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-[#33c213] rounded-lg border border-[#33c213] text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px] p-3 cursor-pointer ml-2 transition-colors duration-300 ease-in-out"
                  onClick={createBooking}
                >
                  Create Booking
                </button>
              )}
              <button
                type="button"
                className="text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px] border-none rounded-md px-5 py-2.5 cursor-pointer ml-2 transition-colors duration-300 ease-in-out"
                onClick={closeModal}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <CheckValidityModal
        isOpen={validityModelOpen}
        onClose={validityModelClose}
      />
    </>
  );
};

export default BookingModal;
