import axiosInstance from "../../../../../../axios/axiosInstance";
import * as helper from "./helper";
import * as bookingService from "../../common/Services/booking.service";
import { fetchedMonths } from '../../../../variables/genVariables';

let allBookings: any = [];


const getUpdatedServices = async (providerId: string) => {

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
const mapBookings = (appointments: any[]) => {
  return appointments.map((event: any) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.start),
    allDay: false,
    serviceId: event.service_id,
    customerNotes: event.customer_notes,
    customerEmailAddress: event.customer_email_address,
    customerPhone: event.customer_phone,
    staffMemberIds: Array.isArray(event.member_id) ? event.member_id : event.member_id ? [event.member_id] : [],
    optOutOfCustomerEmail: event.send_emails,
    isCustomerAllowedToManageBooking: event.manage_booking,
    healthCardNumber: event.health_card_number,
  }));
};

export const fetchDataFromDb = async (
  provider: any,
  setEventsData: any,
  setLoading: any,
  setServices: any
) => {
    try {
      const providerId = provider.providerID;
      const services=  await getUpdatedServices(providerId);
      setServices(services);
      await fetchAllBookings(providerId);

      if (allBookings.length > 0) {
        const bookings = mapBookings(allBookings);
        setEventsData(bookings);
      }else{
        setEventsData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
};

async function fetchAllBookings(providerId: any) {
    const response = await bookingService.fetchData("bookings",providerId);
    console.log(response);
    if (response?.data) {
      allBookings = allBookings.concat(response.data);
    } 
  }



async function fetchBookingsByDate(providerId: any) {
  let bookings: any = [];
  const response = await bookingService.fetchData("bookings",providerId);
    if (response?.data) {
      // Append fetched data to allBookings
      bookings = bookings.concat(response.data);
    } 
    return bookings;
  }



export const handleNavigate = async (provider: any, date: Date,setEventsData: any,setLoading: any) => {
  const defaultRange = helper.getDefaultRangeForBookings();
  const providerID = provider.providerID;

  const startDate = new Date(defaultRange.start);
  const endDate = new Date(defaultRange.end);

  const currentMonthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}`;
  // const range  = helper.getCurrentMonthRange(date);
  if ((date < startDate || date > endDate) && !fetchedMonths.has(currentMonthKey)) {
    try {
      setLoading(true);
      const bookingsData = await fetchBookingsByDate(providerID);
      const bookings = mapBookings(bookingsData);
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