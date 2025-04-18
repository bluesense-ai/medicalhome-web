import axiosInstance from "../../../../../../axios/axiosInstance";
import * as helper from "./helper";
import * as syncData from "./syncData";
import * as bookingController from "./bookingController";
import { toast } from "react-toastify";
import * as dbFunc from "./dbFunctions";
import { getMSClient } from "../../../../../../api/external/microsoft";
import db from "../Services/indexedDB";
import { fetchedMonths } from '../../../../variables/genVariables';

let allBookings: any = [];


const getUpdatedServices = async (services: any[], providerId: string) => {
  await syncData.syncServices(services, providerId);

  const updatedServiceResponse = await axiosInstance.get(
    `${import.meta.env.VITE_BACKEND_URL}/providers/${providerId}/services`
  );

  return updatedServiceResponse.data.map((service: any) => ({
    id: service.id,
    ms_id: service.ms_id,
    name: service.name,
    description: service.description,
    price: service.price,
    defaultDuration: service.default_duration,
  }));
};
const mapBookings = (appointments: any[], updatedServices: any[]) => {
  return appointments.map((event: any) => ({
    id: event.id,
    title: event.customerName,
    start: new Date(event.startDateTime.dateTime),
    end: new Date(event.endDateTime.dateTime),
    allDay: false,
    serviceId: event.serviceId,
    localServiceId: helper.getLocalServiceId(event.serviceId, updatedServices),
    customerNotes: event.customerNotes,
    customerEmailAddress: event.customerEmailAddress,
    customerPhone: event.customerPhone,
    staffMemberIds: event.staffMemberIds,
    optOutOfCustomerEmail: event.optOutOfCustomerEmail,
    isCustomerAllowedToManageBooking: event.isCustomerAllowedToManageBooking,
    healthCardNumber: event.customers[0]?.customQuestionAnswers[0]?.answer,
  }));
};

export const fetchMsData = async (
  msClient: any,
  services: any[],
  eventsData: any[],
  provider: any,
  businessId: string,
  default_staff: any,
  setServices: any,
  setStaff: any,
  setPatientQuestions: any,
  setEventsData: any,
  setLoading: any
) => {
  if (msClient && (services.length === 0 || eventsData.length === 0)) {
    try {
      const providerId = provider.providerID;

      const services = await bookingController.fetchData(
        msClient,
        businessId,
        "services"
      );

      const updatedServices = await getUpdatedServices(services, providerId);
      await dbFunc.syncIndexData("services", updatedServices);
      setServices(updatedServices);


      const staffData = await bookingController.fetchData(
        msClient,
        businessId,
        "staffMembers"
      );
      await dbFunc.syncIndexData("staff", staffData);

      setStaff(staffData);

      default_staff.current = helper.getDefaultStaff(provider, staffData);

      const questionsData = await bookingController.fetchData(
        msClient,
        businessId,
        "customQuestions"
      );
      if (questionsData.length === 0) {
        toast.error(
          "No Health Card question found. Please add it as Required on microsoft Calendar"
        );
      }
      if (questionsData) {
        const questions = questionsData.map((question: any) => ({
          displayName: question.displayName,
          id: question.id,
        }));
        await dbFunc.syncIndexData("questions", questions);
        setPatientQuestions(questions);
      }



      await fetchAllBookings(msClient, businessId);

      if (allBookings.length > 0) {
        const bookings = mapBookings(allBookings, updatedServices);
        await dbFunc.syncIndexData("bookings", bookings);
        setEventsData(bookings);
      }else{
        setEventsData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  } else {
    console.log("no access token");
  }
};

async function fetchAllBookings(msClient: any, businessId: any) {
  const range = helper.getDefaultRangeForBookings();
  let nextLink: any = `calendarView?$select=id,customerName,customerEmailAddress,customerPhone,customerNotes,serviceId,preBuffer,postBuffer,optOutOfCustomerEmail,staffMemberIds,isCustomerAllowedToManageBooking,startDateTime,customers,endDateTime&start=${range.start}&end=${range.end}`;
  while (nextLink) {
    const response = await bookingController.fetchDataRaw(
      msClient,
      businessId,
      nextLink
    );
    if (response?.value) {
      // Append fetched data to allBookings
      allBookings = allBookings.concat(response.value);
      nextLink = response["@odata.nextLink"]
        ? response["@odata.nextLink"].split(
            `solutions/bookingBusinesses/${businessId}/`
          )[1]
        : null;
    } else {
      nextLink = null;
    }
  }
}


async function fetchBookingsByDate(range: any, businessId: any) {
  let bookings: any = [];
  let nextLink: any = `calendarView?$select=id,customerName,customerEmailAddress,customerPhone,customerNotes,serviceId,preBuffer,postBuffer,optOutOfCustomerEmail,staffMemberIds,isCustomerAllowedToManageBooking,startDateTime,customers,endDateTime&start=${range.start}&end=${range.end}`;
  while (nextLink) {
    const response = await bookingController.fetchDataRaw(
      getMSClient(),
      businessId,
      nextLink
    );
    if (response?.value) {
      // Append fetched data to allBookings
      bookings = bookings.concat(response.value);
      nextLink = response["@odata.nextLink"]
        ? response["@odata.nextLink"].split(
            `solutions/bookingBusinesses/${businessId}/`
          )[1]
        : null;
    } else {
      nextLink = null;
    }
  }
  return bookings;
}

export const handleNavigate = async (businessId: string, date: Date,setEventsData: any,setLoading: any) => {
  const defaultRange = helper.getDefaultRangeForBookings();

  const startDate = new Date(defaultRange.start);
  const endDate = new Date(defaultRange.end);

  const currentMonthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}`;
  const range  = helper.getCurrentMonthRange(date);
  if ((date < startDate || date > endDate) && !fetchedMonths.has(currentMonthKey)) {
    try {
      setLoading(true);
      const bookingsData = await fetchBookingsByDate(range, businessId);
      const services = await db.services.toArray();
      const bookings = mapBookings(bookingsData, services);
      setEventsData((prevEventsData:any )=>
         [...prevEventsData, ...bookings]);
      fetchedMonths.add(currentMonthKey);
    }catch (error) {
      console.error("Error fetching bookings:", error);
    }finally{
      setLoading(false);
    }
  } else {
    console.log("The new date is within the booking range.");
  }
  
};