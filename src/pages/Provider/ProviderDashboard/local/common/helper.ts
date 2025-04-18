// src/utils/helper.js




export const parseDuration = (duration:any) => {
  // Parse the duration
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match && match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match && match[2] ? parseInt(match[2], 10) : 0;

  // Calculate the total duration in minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes
};

// Convert from minutes to ISO 8601 (for saving in DB)
export const convertToISO8601 = (minutes: number) => {
  return `PT${minutes}M`;
}


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





