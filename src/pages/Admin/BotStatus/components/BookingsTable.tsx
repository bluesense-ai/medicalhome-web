import React, { useEffect, useState } from "react";
import { formatDateTime } from "../helper/helper.ts";
// import axiosInstance from "../../../../axios/axiosInstance.ts";

interface Booking {
  patient_name?: string;
  health_card_number?: string;
  business_id?: string;
  notes_uploaded?: boolean;
  start?: string;
  createdAt?: string;
}

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
  const [bookingsLocal, setBookingsLocal] = useState<Booking[]>([]);

  useEffect(() => {
    setBookingsLocal(bookings);
  }, [bookings]);
  const handleCheckboxChange = (event: any, booking: any) => {
    const isChecked = event.target.checked;

    console.log(booking);
    // const response = axiosInstance.put(`${import.meta.env.VITE_BOT_URL}/bookings/${booking.id}/notes-uploaded/${isChecked}`);
    setBookingsLocal((prevBookings: any) =>
      prevBookings.map((b: any) =>
        b.id === booking.id ? { ...b, notes_uploaded: isChecked } : b
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-4 border border-gray-300">Patient Name</th>
            <th className="py-3 px-4 border border-gray-300">
              Health Card Number
            </th>
            <th className="py-3 px-4 border border-gray-300">
              Provider Calendar
            </th>
            <th className="py-3 px-4 border border-gray-300">Notes Uploaded</th>
            <th className="py-3 px-4 border border-gray-300 min-w-80">
              Booking Time
            </th>
            <th className="py-3 px-4 border border-gray-300 min-w-80">
              Added At
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingsLocal.map((booking, index) => {
            const createdAt = booking.createdAt
              ? formatDateTime(booking.createdAt)
              : { date: "N/A", time: "N/A" };
            const start = booking.start
              ? formatDateTime(booking.start)
              : { date: "N/A", time: "N/A" };

            return (
              <tr key={index} className="text-center">
                <td className="py-3 px-4 border border-gray-300">
                  {booking.patient_name || ""}
                </td>
                <td className="py-3 px-4 border border-gray-300">
                  {booking.health_card_number || ""}
                </td>
                <td className="py-3 px-4 border border-gray-300">
                  {booking.business_id || ""}
                </td>
                {import.meta.env.VITE_ENV === "staging" || import.meta.env.VITE_ENV === "production" ? (
                    <td className="py-3 px-4 border border-gray-300">
                    <input
                      type="checkbox"
                      className={`w-6 h-6  ${
                        booking.notes_uploaded
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      onChange={(e) => handleCheckboxChange(e, booking)}
                      checked={booking.notes_uploaded}
                      disabled={!booking.notes_uploaded}
                    />
                  </td>
                ):(
                  <td className="py-3 px-4 border border-gray-300">
                   {booking.notes_uploaded ? "Yes" : ""}
                  </td>
                )}
                <td className="py-3 px-4 border border-gray-300">
                  {start.date !== "N/A" && (
                    <span className="px-3 py-1 bg-indigo-500 text-white rounded">
                      {start.date}, {start.time}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border border-gray-300">
                  {createdAt.date !== "N/A" ? (
                    <span className="px-3 py-1 bg-indigo-500 text-white rounded">
                      {createdAt.date}, {createdAt.time}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
