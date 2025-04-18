export const formatForDateTime = (date: any) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };
  
  export const getEndTime = (start: string, duration: string) => {
    const startDate = new Date(start);
  
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match && match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match && match[2] ? parseInt(match[2], 10) : 0;
  
    const totalMinutes = hours * 60 + minutes;
    const endDate = new Date(startDate.getTime() + totalMinutes * 60000);
  
    return formatForDateTime(endDate);
  };
  