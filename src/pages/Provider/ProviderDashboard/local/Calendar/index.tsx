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
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import * as helper from "./Helpers/helper.js";
import { getMSClient } from "../../../../../api/external/microsoft.js";
import { fetchDataFromDb } from "./Helpers/initData.js";
import * as msData from "./Helpers/initData.js"

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
  const [staff] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [msClient, setMsClient] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
 
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

  const handleBookFollowUp = async () => {
    if (default_staff.current == null) {
      setLoading(false);
      return 0;
    }
    // const startTime = commonHelper.formatDate(new Date().toISOString().split("T")[0]);
    setModalIsOpen(true);
  };
 

  useEffect(() => {
    const fetchData = async () => {
        await fetchDataFromDb(
          provider,
          setEventsData,
          setLoading,
          setServices,
        );
        if (bookFollowUp) {
          handleBookFollowUp();
        }
      }
    fetchData();
  }, []);


  const toggleMoreOptions = () => {
    setShowMoreOptions((prevState) => !prevState);
  };



  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const expandBooking = () => {
    setModalIsOpen(true);
    setIsPopupOpen(false);
  };
  const handleSelectSlot = ({ start }: { start: Date }) => {
   setSelectedSlot(start);
   setModalIsOpen(true);
  }
  const handleSelectEvent = (
    event: any,
    _e?: React.SyntheticEvent<HTMLElement>
  ) => {
    setSelectedEvent(event);
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
          onNavigate={(newDate) => msData.handleNavigate(provider, newDate,setEventsData,setLoading)}
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
                (service: any) => service.id === eventProps.serviceId
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
         services={services}
         isPopupOpen={isPopupOpen}
         selectedEvent={selectedEvent}
         toggleMoreOptions={toggleMoreOptions}
         showMoreOptions={showMoreOptions}
         closeModal={closeModal}
         openCancellationPopup={openCancellationPopup}
         selectedSlot={selectedSlot}
         setEventsData={setEventsData}

       />
      
     
      <CancellationModal
        isOpen={cancellationPopupIsOpen}
        onRequestClose={closeCancellationPopup}
        msClient={msClient}
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
