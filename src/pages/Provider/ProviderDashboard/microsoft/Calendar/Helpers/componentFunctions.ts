import axiosInstance from "../../../../../../axios/axiosInstance";
import { SetStateAction } from "react";
import * as helper from "./helper";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const checkExistingPatient = async (
  formValues: any,
  setFormValues: (values: any) => void,
): Promise<void> => {
  if (formValues.healthCardNumber.length === 9) {

    try {
      const response = await axiosInstance.get(
        `${backendUrl}/patients/${formValues.healthCardNumber}`
      );
      if (response.data) {
        setFormValues({
          ...formValues,
          customerPhone: response.data.phone_number || "",
          customerEmailAddress: response.data.email_address || "",
          title: `${response.data.first_name} ${response.data.last_name}`,
          healthCardNumber: response.data.health_card_number.replace(/-/g, ""),
        });
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  }
};


export const initializeFormValues = (
  selectedEvent: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  helper: any
) => {
  if (selectedEvent) {
    setFormValues({
      title: selectedEvent.title,
      start: helper.formatDateTime(selectedEvent.start),
      startTime: helper.formatDateTime(selectedEvent.start),
      end: helper.formatDateTime(selectedEvent.end),
      serviceId: selectedEvent.serviceId,
      localServiceId: selectedEvent.localServiceId,
      customerNotes: selectedEvent.customerNotes || "",
      staffMemberIds: selectedEvent.staffMemberIds || [],
      customerPhone: selectedEvent.customerPhone || "",
      customerEmailAddress: selectedEvent.customerEmailAddress || "",
      isCustomerAllowedToManageBooking:
        selectedEvent.isCustomerAllowedToManageBooking || false,
      optOutOfCustomerEmail: selectedEvent.optOutOfCustomerEmail || false,
      healthCardNumber: selectedEvent.healthCardNumber || "",
    });
  }
};



export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  services: any[],
  formValues: any,
  checkAvailability: (serviceId: string, startTime?: string) => void,
  setFormValues: React.Dispatch<SetStateAction<any>>,
) => {
  const { name, value, type } = e.target;
    let fieldValue: any;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    } else {
      fieldValue = value;
    }
    if (name === "healthCardNumber") {
      fieldValue = value.replace(/\D/g, "");
      if (fieldValue > 9) {
        fieldValue = fieldValue.slice(0, 9);
      }
    }

    setFormValues((prevValues: any) => {
      const updatedValues = { ...prevValues, [name]: fieldValue };
      if (name === "service") {
        updatedValues.serviceId = fieldValue;
        if (fieldValue) {
          checkAvailability(helper.getMsServiceId(fieldValue, services));
        }
      }

      if (name === "start" && formValues.serviceId) {
        const selectedService = services.find(
          (service) => service.id === formValues.serviceId
        );
        checkAvailability(selectedService?.ms_id, value);
      }
      if (name == "startTime") {
        const selectedService = services.find(
          (service) => service.id === formValues.serviceId
        );
        updatedValues.start = value;
        if (selectedService) {
          updatedValues.end = helper.getEndTime(
            value,
            selectedService.defaultDuration
          );
        }
      }
      return updatedValues;
    });
};


export const handleSelectSlot = (
  start: any,
  isPopupOpen: boolean,
  setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>,
  default_staff: React.RefObject<any>,
  services: any[],
  formValues: any,
  setFormValues: React.Dispatch<SetStateAction<any>>,
  setModalIsOpen: React.Dispatch<SetStateAction<boolean>>,
  provider: any,
  checkAvailability: (serviceId: string, startTime?: string) => void
) => {
  if (isPopupOpen) {
    setIsPopupOpen(false);
    return;
  }
  if (!default_staff.current) {
    toast.error(
      `No matching staff found for provider email: ${provider.emailAddress}`
    );
    return 0;
  }
  const firstService = services[0]?.id || "";
  const local_id = services[0]?.local_id || "";
  const formattedStart = helper.formatDate(start);
  checkAvailability(services[0]?.ms_id, formattedStart);

  setFormValues({
    ...formValues,
    serviceId: firstService,
    localServiceId: local_id,
    start: formattedStart,
    startTime: null,
    title: "",
    staffMemberIds: [default_staff.current],
    customerPhone: "",
    customerNotes: "",
    customerEmailAddress: "",
    healthCardNumber: "",
    optOutOfCustomerEmail: false,
    isCustomerAllowedToManageBooking: false,
  });

  // Open the modal
  setModalIsOpen(true);
}