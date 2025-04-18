import axiosInstance from "../../../../../../axios/axiosInstance";
import * as commonHelper from "../../common/helper";
import { SetStateAction } from "react";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const checkAvailability = async (
  serviceId: any,
  start: any = null,
  setLoadingAvailability:Function,
  setAvailableTimeSlots:Function,
  providerID:any,
  services:any
) => {
    setLoadingAvailability(true);
  const availability = await checkStaffAvailability(
    new Date(start || commonHelper.getUTCDate()),
    serviceId,
    providerID,
    "provider"
  );
  if (availability) {
    const updatedServices = services;
    const selectedService = updatedServices.find(
      (service: any) => service.ms_id === serviceId
    );
    const serviceDuration = selectedService
      ? selectedService.defaultDuration
      : "PT30M";
      console.log(availability,".................");
    setAvailableTimeSlots(
     generateTimeSlots(availability, serviceDuration)
    );
  }
};

export const checkStaffAvailability = async (date:any,  serviceId:any,staff_id:any,staff_type:any) => {
  const startDateTime = date.toISOString();
  const endDateTime =date.toISOString(); // Adjusting end time for an 8-hour workday
  try {
    const body = {
      startDateTime: {
        dateTime: startDateTime,
        timeZone: "UTC",
      },
      endDateTime: {
        dateTime: endDateTime,
        timeZone: "UTC",
      },
      serviceId: serviceId,
    };
    const response = await axiosInstance
      .post(`${import.meta.env.VITE_BACKEND_URL}/staff/${staff_type}/${staff_id}/availability`, { params: body });
      console.log(response.data);
      return response.data;
  } catch (error) {
    console.error("Error checking staff availability:", error);
    return null;
  }
};
export const generateTimeSlots = (availability:any, serviceDuration:any) => {
    const availableTimeSlots: { start: Date; end: Date }[] = [];
    availability.forEach((item:any) => {
      if (item.status === 'available') {
        const start = new Date(item.startDateTime.dateTime+'Z');
        const end = new Date(item.endDateTime.dateTime+'Z');
        let slotStart = new Date(start);
        const durationInMinutes =  commonHelper.parseDuration(serviceDuration);
  
        while (slotStart < end) {
          const slotEnd = new Date(slotStart.getTime() + durationInMinutes * 60000);
  
          if (slotEnd <= end) {
            availableTimeSlots.push({
              start: slotStart,
              end: slotEnd,
            });
          }
  
          slotStart = new Date(slotStart.getTime() + durationInMinutes * 60000); 
        }
      }
    });
    return availableTimeSlots;
  };
  
  export const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    services: any[],
    formValues: any,
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
        }
  
        if (name === "start" && formValues.serviceId) {
          // const selectedService = services.find(
          //   (service) => service.id === formValues.serviceId
          // );
        }
        if (name == "startTime") {
          const selectedService = services.find(
            (service) => service.id === formValues.serviceId
          );
          updatedValues.start = value;
          if (selectedService) {
            updatedValues.end = commonHelper.getEndTime(
              value,
              selectedService.defaultDuration
            );
          }
        }
        return updatedValues;
      });
  };

  
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
) => {
  if (selectedEvent) {
    setFormValues({
      title: selectedEvent.title,
      start: commonHelper.formatDateTime(selectedEvent.start),
      startTime: commonHelper.formatDateTime(selectedEvent.start),
      end: commonHelper.formatDateTime(selectedEvent.end),
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
) => {
  if (isPopupOpen) {
    setIsPopupOpen(false);
    return;
  }
  if (!default_staff.current) {
    console.error(
      `No matching staff found for provider email: ${provider.emailAddress}`
    );

  }
  const firstService = services[0]?.id || "";
  const local_id = services[0]?.local_id || "";
  const formattedStart = commonHelper.formatDate(start);
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