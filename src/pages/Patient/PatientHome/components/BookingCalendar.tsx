import React from "react";
interface BookingCalendarProps {
  providerCalendarId: string;
  onIframeLoad: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  providerCalendarId,
  onIframeLoad,
}) => {
  const bookingPageUrl = `https://outlook.office365.com/owa/calendar/${providerCalendarId}/bookings/`;
  return (
    <div style={{ height: "1770px", width: "98%" }}>
      <iframe
        src={bookingPageUrl}
        style={{ border: "none", width: "100%", height: "100%" }}
        title="Microsoft Bookings"
        onLoad={onIframeLoad}
      />
    </div>
  );
};

export default BookingCalendar;
