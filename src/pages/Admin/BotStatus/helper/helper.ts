export const formatDateTime = (dateTime: string | Date): { date: string; time: string } => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  return { date: formattedDate, time: formattedTime };
};
