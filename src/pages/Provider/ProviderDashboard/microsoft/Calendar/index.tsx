import { useState, useEffect, useRef } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomToolbar from "./components/CustomToolbar/index.js";
import TimeGutterHeader from "./components/TimeGutterHeader/index.js";
import CustomDayEvent from "./components/CustomDayEvent/index.js";
import CustomWeekEvent from "./components/CustomWeekEvent/index.js";
import CustomMonthEvent from "./components/CustomMonthEvent/index.js";

import "./CustomCalendarStyles.css"; // Your custom styles

import BookingModal from "../BookingModals/BookingModal.js";
import CancellationModal from "../BookingModals/CancellationModal.js";
import EventPopup from "../BookingModals/EventPopup.js";
import Loader from "../../../../../components/Loader/index.js";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import * as helper from "./Helpers/helper.js";
import * as compFunc from "./Helpers/componentFunctions.js";
import * as bookingController from "./Helpers/bookingController.js";
import { getMSClient } from "../../../../../api/external/microsoft.js";
import { fetchMsData } from "./Helpers/initMsData.js";
import db from "./Services/indexedDB.js";
import * as msData from "./Helpers/initMsData.js"


interface Question {
  id: string;
  displayName: string;
}

const MyCalendar = () => {
  const localizer = momentLocalizer(moment); // or globalizeLocalizer
  const location = useLocation();

  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
        username: string;
        methodOfVerification: string;
        ms_calendar_id: string;
        emailAddress: string;
      };
    }) => state.provider
  );
  const bookingDate = location.state?.bookingDate;
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const bookFollowUp = location.state?.bookFollowUp;
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState("");
  const [staff, setStaff] = useState<any[]>([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [msClient, setMsClient] = useState<any>(null);
  const [patientQuestions, setPatientQuestions] = useState<Question[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [indexedBdHasData, setIndexedBdHasData] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [formValues, setFormValues] = useState<any>({
    title: "",
    start: "",
    end: "",
    customerNotes: "",
    serviceId: "",
    staffMemberIds: [],
    customerPhone: "",
    customerEmailAddress: "",
    isCustomerAllowedToManageBooking: false,
    optOutOfCustomerEmails: false,
    healthCardNumber: "",
    localServiceId: "",
  });

  const [cancellationPopupIsOpen, setCancellationPopupIsOpen] = useState(false);
  const [dropdownCoordinates, setDropdownCoordinates] = useState({
    xPosition: 0,
    yPosition: 0,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const default_staff = useRef(null);
  const openCancellationPopup = () => {
    setModalIsOpen(false);
    setCancellationPopupIsOpen(true);
  };
  const closeCancellationPopup = () => setCancellationPopupIsOpen(false);

  useEffect(() => {
    setMsClient(getMSClient());
  }, []);

  const handleBookFollowUp = async (updatedServices: any) => {
    if (default_staff.current == null) {
      setLoading(false);
      return 0;
    }
    const startTime = helper.formatDate(new Date().toISOString().split("T")[0]);
    setModalIsOpen(true);
    const updatedValues = {
      healthCardNumber: bookFollowUp.healthCardNumber,
      serviceId: bookFollowUp.serviceId,
      start: startTime,
      staffMemberIds: [default_staff.current],
    };
  
    setFormValues({
      ...formValues,
      ...updatedValues,
      end: startTime,
    });
    checkAvailability(
      helper.getMsServiceId(bookFollowUp.serviceId, updatedServices),
      null,
      updatedServices
    );
  };
  useEffect(() => {
    const loadFromIndexedDB = async () => {
      setLoading(true);
      const services = await db.services.toArray();
      const staff = await db.staff.toArray();
      const questions = await db.questions.toArray();
      const bookings = await db.bookings.toArray();

      if (
        services.length &&
        staff.length &&
        questions.length &&
        bookings.length
      ) {
        setServices(services);
        setStaff(staff);
        setPatientQuestions(questions);
        setEventsData(bookings);

        default_staff.current = helper.getDefaultStaff(provider, staff);
        setLoading(false);
        if (bookFollowUp) {
          handleBookFollowUp(services);
        }
      } else {
        setIndexedBdHasData(false);
        setLoading(true);
      }
    };

    loadFromIndexedDB();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (msClient) {
        await fetchMsData(
          msClient,
          services,
          eventsData,
          provider,
          businessId,
          default_staff,
          setServices,
          setStaff,
          setPatientQuestions,
          setEventsData,
          setLoading
        );
        if (bookFollowUp && !indexedBdHasData) {
          handleBookFollowUp(services);
        }
      }
    };
    fetchData();
  }, [msClient]);

  const handleStaffChange = (selectedOptions: any) => {
    const selectedStaffIds = selectedOptions.map((option: any) => option.value);
    setFormValues((prevState: any) => ({
      ...prevState,
      staffMemberIds: selectedStaffIds,
    }));
  };

  const toggleMoreOptions = () => {
    setShowMoreOptions((prevState) => !prevState);
  };

  useEffect(() => {
    if (provider.ms_calendar_id) {
      setBusinessId(provider.ms_calendar_id);
    } else {
      toast.error("Provider calendar not found, Please Add Microsoft Calendar");
    }
  }, []);

  useEffect(() => {
    if (formValues.healthCardNumber && !isPopupOpen) {
      compFunc.checkExistingPatient(formValues, setFormValues);
    }
  }, [formValues.healthCardNumber]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    compFunc.handleChange(
      e,
      services,
      formValues,
      checkAvailability,
      setFormValues
    );
  };

  const checkAvailability = async (
    serviceId: any,
    date: any = null,
    localServices: any = null
  ) => {
    if (msClient == null) {
      setLoadingAvailability(true);
      return;
    }
    const availability = await helper.checkStaffAvailability(
      default_staff.current,
      new Date(date || formValues.start || helper.getUTCDate()),
      msClient,
      businessId,
      serviceId
    );
    if (availability) {
      const updatedServices = localServices || services;
      const selectedService = updatedServices.find(
        (service: any) => service.ms_id === serviceId
      );
      const serviceDuration = selectedService
        ? selectedService.defaultDuration
        : "PT30M";
      setAvailableTimeSlots(
        helper.generateTimeSlots(availability[0], serviceDuration)
      );
    }
  };
  // update this for #ms_to_local as event will come from local db

  useEffect(() => {
    compFunc.initializeFormValues(selectedEvent, setFormValues, helper);
  }, [selectedEvent]);

  useEffect(() => {
    if (msClient && loadingAvailability) {
      const fetchAvailability = async () => {
        await checkAvailability(
          helper.getMsServiceId(bookFollowUp.serviceId, services),
          null,
          services
        );
        setLoadingAvailability(false);
      };
      fetchAvailability();
    }
  }, [msClient, loadingAvailability]);

  const createBooking = async () => {
    await bookingController.createBooking({
      msClient,
      formValues,
      services,
      patientQuestions,
      businessId,
      setEventsData,
      setModalIsOpen,
      setLoading,
      eventsData,
    });
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    compFunc.handleSelectSlot(
      start,
      isPopupOpen,
      setIsPopupOpen,
      default_staff,
      services,
      formValues,
      setFormValues,
      setModalIsOpen,
      provider,
      checkAvailability
    );
  };

  const updateBooking = async () => {
    await bookingController.updateBooking({
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
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const expandBooking = () => {
    setModalIsOpen(true);
    setIsPopupOpen(false);
  };

  const handleSelectEvent = (
    event: any,
    _e?: React.SyntheticEvent<HTMLElement>
  ) => {
    const updatedEvent = {
      ...event,
      serviceId: helper.getLocalServiceId(event.serviceId, services),
    };
    checkAvailability(event.serviceId, helper.formatDate(event.start));
    setSelectedEvent(updatedEvent);
    setIsPopupOpen(true);
  };

  const handleOnClick = (e: { clientX: number; clientY: number }) => {
    const { xPosition, yPosition } = helper.getDropdownCoordinates(
      e.clientX,
      e.clientY
    );
    setDropdownCoordinates({ xPosition, yPosition });
  };

  const handleCloseDropdown = () => {
    setIsPopupOpen(false);
  };
  
  
  return (
    <>
      <div className="h-full w-full" onClick={handleOnClick}>
        <Calendar
          selectable
          onNavigate={(newDate) => msData.handleNavigate(businessId, newDate,setEventsData,setLoading)}
          views={["day", "week", "month"]}
          localizer={localizer}
          defaultDate={bookingDate ? bookingDate : new Date()}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 21, 20, 0)}
          defaultView="day"
          className="pt-24 h-full w-full text-black text-opacity-80 text-[15px] font-normal leading-6 tracking-tight font-['Roboto']"
          components={{
            toolbar: CustomToolbar,
            timeGutterHeader: TimeGutterHeader,
            day: {
              event: (eventProps) => (
                <CustomDayEvent event={eventProps.event} services={services} />
              ),
            },
            week: {
              event: CustomWeekEvent,
            },
            month: {
              event: CustomMonthEvent,
            },
            // eventWrapper: CustomEventWrapper,
          }}
          events={eventsData}
          eventPropGetter={(eventProps: any) => {
            const serviceName =
              services?.find(
                (service: any) => service.ms_id === eventProps.serviceId
              )?.name || "Unknown Service";
            return {
              style: {
                backgroundColor: `${
                  serviceName.includes("Same Day") ? "#247401" : "#004f62"
                }`,
                borderRadius: "4px",
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingTop: "3px",
                paddingBottom: "3px",
                minHeight: "35px",
              },
            };
          }}
          //  serviceName === "Same Day/Walk in" ? "#247401" : "#004f62"
          dayPropGetter={() => {
            return {
              style: {
                backgroundColor: "#f2f8ff",
              },
            };
          }}
          step={15}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          // onEventDrop={moveEvent}
          // onEventResize={resizeEvent}
        />
      </div>
      {/* <button onClick={() => console.log(selectedEvent)}>Test</button> */}
    
         <BookingModal
         isOpen={modalIsOpen}
         onRequestClose={closeModal}
         formValues={formValues}
         services={services}
         staff={staff}
         handleChange={handleChange}
         availableTimeSlots={availableTimeSlots}
         handleStaffChange={handleStaffChange}
         createBooking={createBooking}
         updateBooking={updateBooking}
         selectedEvent={selectedEvent}
         toggleMoreOptions={toggleMoreOptions}
         showMoreOptions={showMoreOptions}
         closeModal={closeModal}
         openCancellationPopup={openCancellationPopup}
         loadingAvailability={loadingAvailability}
       />
      
     
      <CancellationModal
        isOpen={cancellationPopupIsOpen}
        onRequestClose={closeCancellationPopup}
        msClient={msClient}
        businessId={businessId}
        selectedEvent={selectedEvent}
        eventsData={eventsData}
        setEventsData={setEventsData}
        setLoading={setLoading}
        closeCancellationPopup={closeCancellationPopup}
      />
      <EventPopup
        isOpen={isPopupOpen}
        onRequestClose={handleCloseDropdown}
        dropdownCoordinates={dropdownCoordinates}
        selectedEvent={selectedEvent}
        staff={staff}
        services={services}
        expandBooking={expandBooking}
      />
   
      {loading && <Loader />}
    </>
  );
};

export default MyCalendar;
