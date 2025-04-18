// src/utils/helper.js
import { toast } from 'react-toastify'; // Import toast if needed

export const getDefaultStaff = (provider: any, staff: any) => {
  if (provider && provider.emailAddress) {
    const matchingStaff = staff.find(
      (s:any) => s.emailAddress === provider.emailAddress
    );
    
    if (matchingStaff) {
      return matchingStaff.id;
    } else {
      toast.error(`No matching staff found for provider email: ${provider.emailAddress}`);
    }
  } else {
    console.error("Provider email is missing or invalid.");
  }

  return  null;
};

export const checkStaffAvailability = async (staffId:any, date:any, msClient:any, businessId:any, serviceId:any) => {
  const startDateTime = date.toISOString();
  const endDateTime = new Date(date.getTime() + 23 * 60 * 60 * 1000).toISOString(); // Adjusting end time for an 8-hour workday
  try {
    const body = {
      staffIds: [staffId],
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
    const response = await msClient
      .api(`/solutions/bookingBusinesses/${businessId}/getStaffAvailability`)
      .post(body);
    return response.value;
  } catch (error) {
    console.error("Error checking staff availability:", error);
    return null;
  }
};

export const generateTimeSlots = (availability:any, serviceDuration:any) => {
  const availableTimeSlots: { start: Date; end: Date }[] = [];
  availability.availabilityItems.forEach((item:any) => {
    if (item.status === 'available') {
      const start = new Date(item.startDateTime.dateTime+'Z');
      const end = new Date(item.endDateTime.dateTime+'Z');
      let slotStart = new Date(start);
      const durationInMinutes = parseDuration(serviceDuration);

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

export const parseDuration = (duration:any) => {
  // Parse the duration
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match && match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match && match[2] ? parseInt(match[2], 10) : 0;

  // Calculate the total duration in minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes
};


export const formatDate = (date:any) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  // const hour = String(date.getHours()).padStart(2, "0");
  // const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}`;

};

export const formatDateTime = (date:any) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export const getEndTime = (start:any, duration:any) => {
  const startDate = new Date(start);

  const totalMinutes = parseDuration(duration);
  // Calculate the new end time
  const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

  return formatDateTime(endDate);
};

export const formatTime = (dateString:any) => {
  const date = new Date(dateString);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return timeString;
}
export const getLocalServiceId = (serviceId: string, updatedServices: any[]) => {
  return (
    updatedServices.find((service) => service.ms_id === serviceId)?.id || null
  );
};
export const getMsServiceId = (serviceId: any, updatedServices: any[]) => {

  return (
    updatedServices.find((service) => service.id === serviceId)?.ms_id || null
  );
};

export const getUTCDate = () => {
 return new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  ))
}


export const getDropdownCoordinates = (  clientX: number,
  clientY: number,
) => {
  const modalWidth = 300; // Adjust as needed
  const modalHeight = 200; // Adjust as needed
  const buffer = 20; // Space from the edge

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let xPosition = clientX;
  let yPosition = clientY;

  if (viewportWidth < 480) {
    // Center the modal
    xPosition = (viewportWidth - 18) / 2;
    yPosition = (viewportHeight - modalHeight) / 2;
  } else {
    // Adjust yPosition if too close to the bottom
    if (yPosition + modalHeight > viewportHeight - buffer) {
      yPosition = viewportHeight - modalHeight - buffer;
    }

    // Adjust xPosition if too close to the right
    if (xPosition + modalWidth > viewportWidth - buffer) {
      xPosition = viewportWidth - modalWidth - buffer;
    }

    // Adjust xPosition if too close to the left
    if (xPosition < 275) {
      xPosition = buffer + 275;
    }

    // Ensure xPosition is not below zero
    if (xPosition < 0) {
      xPosition = 0;
    }
  }

  return { xPosition, yPosition };
};


export function getDefaultRangeForBookings() {
  const now = new Date();
  const startDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth()-1,
    1,
  ));


  const endDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth() + 1, 
    0
  ));
  endDate.setUTCHours(23, 59, 59, 999);

  const formatDateToISOString = (date:any) => 
    date.toISOString().split('.')[0] + 'Z';

  return {
    start: formatDateToISOString(startDate),
    end: formatDateToISOString(endDate),
  };
}


export function getCurrentMonthRange(date:any) {
  const now = new Date(date);

 
  const startDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(), // Current month
    1 // First day of the month
  ));


  const endDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ));
  endDate.setUTCHours(23, 59, 59, 999);
  // Reuse the same formatting function
  const formatDateToISOString = (date: any) =>
    date.toISOString().split('.')[0] + 'Z';

  return {
    start: formatDateToISOString(startDate),
    end: formatDateToISOString(endDate),
  };
}