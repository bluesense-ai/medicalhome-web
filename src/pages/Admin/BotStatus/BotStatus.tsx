import { useEffect, useState } from "react";
import axios from "axios";
import LastBatchExecutionTable from "./components/LastBatchExecutionTable";
import BookingsTable from "./components/BookingsTable";

const ServiceStatusDashboard = () => {
  const [batchExecution, setBatchExecution] = useState({
    lastExecution: "N/A",
    nextExecution: "N/A",
  });
  const [bookings, setBookings] = useState([]);
  const [serviceStatus, setServiceStatus] = useState({
    status: true,
    message: "",
  });
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("All"); 

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BOT_URL}/status/services`);
      const { bookings: bookingData, variables, serviceStatus } = response.data;
      

      setServiceStatus(serviceStatus);

      const processingValue =
        variables.find((v: any) => v.type === "processing")?.value || "N/A";
      const nextBatchValue =
        variables.find((v: any) => v.type === "next_batch")?.value || "N/A";

      const formatDateTime = (value: string) => {
        const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };

        return {
          date: new Date(value).toLocaleDateString(undefined, dateOptions),
          time: new Date(value).toLocaleTimeString(undefined, timeOptions),
        };
      };

      setBatchExecution({
        lastExecution: formatDateTime(processingValue).date + " " + formatDateTime(processingValue).time,
        nextExecution: formatDateTime(nextBatchValue).date + " " + formatDateTime(nextBatchValue).time,
      });

      setBookings(bookingData);
      if (bookingData.length > 0) {
        setSelectedBusinessId("All");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const uniqueBusinessIds = ["All", ...new Set(bookings.map((b: any) => b.business_id))];

  

  const filteredBookings =
    selectedBusinessId === "All"
      ? bookings
      : bookings.filter((booking: any) => booking.business_id === selectedBusinessId);


  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-4xl font-bold text-center mb-6">Service Status Dashboard</h1>
      <button
        type="button"
        onClick={() => (window.location.href = "/admin/dashboard")}
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        <i className="fa-solid fa-arrow-left"></i> &nbsp; Dashboard
      </button>

      {/* Service Status Section */}
      <section className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-3">Service Status</h2>
        <p className="text-gray-600 mb-5">
          Shows current service functionality based on next scheduled batch execution.
        </p>
        <div>
          <span
            className={`px-4 py-2 text-lg font-bold rounded ${
              serviceStatus.status ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {serviceStatus.message}
          </span>
        </div>
      </section>

      {/* Last Batch Execution Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">Last Batch Execution</h2>
        <p className="text-gray-600 mb-5">
          Timestamp of the last and upcoming batch execution processes.
        </p>
        <LastBatchExecutionTable batchExecution={batchExecution} serviceStatus={serviceStatus} />
      </section>

      {/* Bookings Section with Tabs */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Last Inserted Booking</h2>
        <p className="text-gray-600 mb-5">Details of the most recently added patient and booking.</p>
        <div className="mb-4">
          {uniqueBusinessIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedBusinessId(id)}
              className={`px-4 py-2 mr-2 rounded ${
                selectedBusinessId === id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {id || "N/A"}
            </button>
          ))}
        </div>
        <BookingsTable bookings={filteredBookings} />
      </section>
    </div>
  );
};

export default ServiceStatusDashboard;
