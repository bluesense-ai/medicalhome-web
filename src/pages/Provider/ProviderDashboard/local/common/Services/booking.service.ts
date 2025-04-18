
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../axios/axiosInstance";



const createEvent = ({
  eventId,
  formValues,
}: {
  eventId: any;
  formValues: any;
}) => {
  return {
    id: eventId,
    title: formValues.title,
    start: new Date(formValues.start),
    end: new Date(formValues.end),
    allDay: false,
    serviceId: formValues.serviceId,
    customerNotes: formValues.customerNotes,
    customerEmailAddress: formValues.customerEmailAddress,
    customerPhone: formValues.customerPhone,
    staffMemberIds: formValues.staffMemberIds,
    optOutOfCustomerEmail: formValues.optOutOfCustomerEmail || false,
    isCustomerAllowedToManageBooking:
      formValues.isCustomerAllowedToManageBooking || false,
    healthCardNumber: formValues.healthCardNumber || "",
  };
};



export const updateBooking = async ({
  selectedEvent,
  formValues,
  setEventsData,
  setLoading,
  setModalIsOpen,
}: {
  selectedEvent: any;
  formValues: any;
  setEventsData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
  if (!validateBooking(formValues, "update", selectedEvent)) {
    return false;
  }
  setLoading(true);
  try {

    await axiosInstance.put(
      `${import.meta.env.VITE_BACKEND_URL}/bookings/${selectedEvent.id}`,
      formValues
    );




    const newEvent = createEvent({
      eventId: selectedEvent.id,
      formValues
    });
    setEventsData((prevEvents: any) =>
      prevEvents.map((event: any) =>
        event.id === selectedEvent.id ? newEvent : event
      )
    );

    setModalIsOpen(false);
    toast.success("Booking updated successfully!", { autoClose: 3000 });

    //   console.log(updatedEvent,"................");
    // setEventsData((prevEvents:any) => [...prevEvents, updatedEvent]);

    // setModalIsOpen(false);
  } catch (error: any) {
    console.error("Error details:", error);
  } finally {
    setLoading(false);
  }
};

export const deleteBooking = async ({
  selectedEvent,
  // setEventsData,
}: {
  selectedEvent: any;
  // setEventsData: (data: any) => void;
}) => {
  try {

    await axiosInstance.delete(
      `${import.meta.env.VITE_BACKEND_URL}/bookings/${selectedEvent.id}`
    );

    // setEventsData((prevEvents) => prevEvents.filter(event => event.id !== bookingId));

    toast.success("Booking deleted successfully!");
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error("Failed to delete booking.");
  }
};


const validateBooking = (
  formValues: any,
  type: any,
  selectedEvent?: any
): boolean => {

  if (!formValues.serviceId) {
    toast.error("Service must be selected.", {
      autoClose: 3000,
    });
    return false;
  }
  if (type == "update" && !selectedEvent) {
    toast.error("Event must be selected.", {
      autoClose: 3000,
    });
    return false;
  }
  if (formValues.title == "") {
    toast.error("Patient name is required.", {
      autoClose: 3000,
    });
    return false;
  }
  if (!formValues.startTime) {
    toast.error("Please select a time slot.", {
      autoClose: 3000,
    });
    return false;
  }
  if (!formValues.healthCardNumber || formValues.healthCardNumber.length == 0) {
    toast.error("Health card number Not provided.", {
      autoClose: 3000,
    });
    return false;
  }

  return true; // Validation passed
};

export const createBooking = async ({

  formValues,
  setEventsData,
  setModalIsOpen,
  setLoading
}: {

  formValues: any;
  setEventsData: (data: any) => void;
  setModalIsOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
}) => {
  if (!validateBooking(formValues, "create")) {
    return false;
  }

  setLoading(true);
  try {
    const selectedEvent = await axiosInstance
      .post(`${import.meta.env.VITE_BACKEND_URL}/bookings`, formValues)
    const newEvent = createEvent({
      eventId: selectedEvent.data.id,
      formValues,
    });
    console.log(newEvent, "................");
    setEventsData((prevEvents: any) => [...prevEvents, newEvent]);
    setModalIsOpen(false);
  } catch (error: any) {
    console.error("Error details:", error.response?.data || error.message);
    toast.error(error.message || "Error try again after refreshing", {
      autoClose: 3000,
    });
  } finally {
    setLoading(false); // End loading
  }
};
export const fetchData = async (endpoint: string, providerId: string) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/providers/${providerId}/${endpoint}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

};


