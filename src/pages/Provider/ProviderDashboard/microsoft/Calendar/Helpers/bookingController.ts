
import { toast } from "react-toastify";
import * as helper from "./helper"; 


const createBookingObject = ({
    formValues,
    services,
    patientQuestions,
    startUtc,
    endUtc,
  }: {
    formValues: any;
    services: any[];
    patientQuestions: any[];
    startUtc: string;
    endUtc: string;
  }) => {
    return {
     
        serviceId: helper.getMsServiceId(formValues.serviceId, services),
        startDateTime: { dateTime: startUtc, timeZone: "UTC" },
        endDateTime: { dateTime: endUtc, timeZone: "UTC" },
        customerName: formValues.title,
        customerEmailAddress: formValues.customerEmailAddress,
        customerPhone: formValues.customerPhone,
        customerNotes: formValues.customerNotes,
        staffMemberIds: formValues.staffMemberIds,
        optOutOfCustomerEmail: formValues.optOutOfCustomerEmail || false,
        isCustomerAllowedToManageBooking:
          formValues.isCustomerAllowedToManageBooking || true,
        customers: [
          {
            "@odata.type": "#microsoft.graph.bookingCustomerInformation",
            name: formValues.title,
            emailAddress: formValues.customerEmailAddress,
            phone: formValues.customerPhone,
            notes: formValues.customerNotes,
            customQuestionAnswers: [
              {
                questionId: patientQuestions[0].id,
                question: patientQuestions[0].displayName,
                answer: formValues.healthCardNumber,
              },
            ],
          },
        ],
    };
};

const createEvent = ({
    selectedEvent,
    formValues,
    services,
  }: {
    selectedEvent: any;
    formValues: any;
    services: any[];
  }) => {
    return {
        id: selectedEvent.id,
          title: formValues.title,
          start: new Date(formValues.start),
          end: new Date(formValues.end),
          allDay: false,
          serviceId: helper.getMsServiceId(formValues.serviceId, services),
          localServiceId: formValues.serviceId,
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
  msClient,
  selectedEvent,
  formValues,
  services,
  patientQuestions,
  businessId,
  eventsData,
  setEventsData,
  setLoading,
  setModalIsOpen,
}: {
  msClient: any;
  selectedEvent: any;
  formValues: any;
  services: any[];
  patientQuestions: any[];
  businessId: string;
  eventsData: any[];
  setEventsData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
    if (!validateBooking(msClient,formValues,services,"update",selectedEvent)) {
        return false;
      }
      setLoading(true);
      try {
        const startUtc = new Date(formValues.start).toISOString();
        const endUtc = new Date(formValues.end).toISOString();
  
        const booking = createBookingObject({
            formValues,
            services,
            patientQuestions,
            startUtc,
            endUtc,
          });
     
        await msClient
          .api(
            `/solutions/bookingBusinesses/${businessId}/appointments/${selectedEvent.id}`
          )
          .patch(booking);
  
          const updatedEvent = createEvent({
            selectedEvent,
            formValues,
            services,
          });
        setEventsData(
          eventsData.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
        );
        setModalIsOpen(false);
      } catch (error: any) {
        console.error("Error details:", error);
      } finally {
        setLoading(false);
      }
};

const validateBooking = (
    msClient: any,
    formValues: any,
    services: any,
    type: any,
    selectedEvent?: any 
  ): boolean => {
   
      const selectedService = services.find(
        (service:any) => service.id === formValues.serviceId
      );
  
      if (!msClient || !selectedService ) {
        toast.error("Service must be selected.", {
          autoClose: 3000,
        });
        return false;
      }
      if(type == "update" && !selectedEvent ) {
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
    msClient,
    formValues,
    services,
    patientQuestions,
    businessId,
    setEventsData,
    setModalIsOpen,
    setLoading,
    eventsData,
  }: {
    msClient: any;
    formValues: any;
    services: any[];
    patientQuestions: any[];
    businessId: string;
    setEventsData: (data: any) => void;
    setModalIsOpen: (isOpen: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    eventsData: any[];
  }) => {
    if (!validateBooking(msClient,formValues,services,"create")) {
        return false;
      }
  
      setLoading(true);
      try {
        const startUtc = new Date(formValues.start).toISOString();
        const endUtc = new Date(formValues.end).toISOString();
  
        const newBooking = createBookingObject({
            formValues,
            services,
            patientQuestions,
            startUtc,
            endUtc,
          });
        const selectedEvent = await msClient
          .api(`/solutions/bookingBusinesses/${businessId}/appointments`)
          .post(newBooking);
        const newEvent = createEvent({
            selectedEvent,
            formValues,
            services,
          });
        setEventsData([...eventsData, newEvent]);
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
  export const fetchData = async (msClient: any, businessId: string, endpoint: string) => {
    try {
      const response = await msClient.api(`/solutions/bookingBusinesses/${businessId}/${endpoint}`).get();
      return response.value;
    }catch (error) {
      // if(endpoint.includes("appointments"))
      //   {}
      toast.error("Can't fetching appointments, Check your connection", { autoClose: 3000 });
      sessionStorage.removeItem("msAccessToken");
      console.error('Error fetching data:', error);
    }
 
  };
  export const fetchDataRaw = async (msClient: any, businessId: string, endpoint: string) => {
    try {
      const response = await msClient.api(`/solutions/bookingBusinesses/${businessId}/${endpoint}`).get();
      return response;
    }catch (error) {
      // if(endpoint.includes("appointments"))
      //   {}
      toast.error("Can't fetching appointments, Check your connection", { autoClose: 3000 });
      sessionStorage.removeItem("msAccessToken");
      console.error('Error fetching data:', error);
    }
 
  };
  
  