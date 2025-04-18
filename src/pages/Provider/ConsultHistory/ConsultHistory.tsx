import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axiosInstance from "../../../axios/axiosInstance";
import ProviderNavbar from "../../../components/ProviderNavbar";
import FilterBox from "./components/FilterBox";
import CopyButton from "../../../components/Common/CopyButton";
import ConsultPDF from "./components/ConsultPDF";

interface Consult {
  id: number;
  title: string;
  assessment: string;
  date_time: string;
  ms_booking_id: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    mobileNumber: string;
    emailAddress: string;
    clinic: string;
    health_card_number: string;
  };
  service: { name: string; id: number; ms_id: string };
  provider: {
    username: string;
    clinic: string;
    first_name: string;
    last_name: string;
  };
  clinic: { name: string };
}

const ConsultsWorkflow: React.FC = () => {
  const [consults, setConsults] = useState<Consult[]>([]);
  const [filteredConsults, setFilteredConsults] = useState<Consult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const patient_hcn = queryParams.get("patient_hcn");

  useEffect(() => {
    let url = `${import.meta.env.VITE_BACKEND_URL}/consults`;
    if (patient_hcn) {
      url = `${
        import.meta.env.VITE_BACKEND_URL
      }/consults/patient/hcn/${patient_hcn}`;
    }
    const fetchConsults = async () => {
      try {
        const response = await axiosInstance.get(url);
        // const data = response.data;
        // console.log("Error here", response.data);
        setConsults(response.data);
        setFilteredConsults(response.data);
      } catch (err) {
        setError("Error fetching consults");
      } finally {
        setLoading(false);
      }
    };

    fetchConsults();
  }, []);

  const handleFilter = (filteredData: Consult[]) => {
    setFilteredConsults(filteredData);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <>
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <div
        className={`flex flex-col items-center justify-start mt-36 gap-[20px] w-full h-full ${
          isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
        }`}
      >
        <div className="w-[80%] h-16 py-[18.50px] bg-[#004f62] rounded-lg justify-center items-center inline-flex">
          <h2 className="text-[#f2f8ff] text-2xl font-bold">Visits Workflow</h2>
        </div>
        <FilterBox consults={consults} onFilter={handleFilter} />
        <div className="w-[80%] p-1 rounded-lg border-2 border-[#004f62]/70">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white-200 rounded-lg border border-[#004f62]/70 overflow-hidden">
              <thead className="text-[#004f62] text-sm font-semibold capitalize leading-normal tracking-wide">
                <tr>
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Patient</th>
                  <th className="text-left p-4">Provider</th>
                  <th className="text-left p-4">Clinic</th>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Assessment</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsults.length > 0 ? (
                  filteredConsults.map((consult, index) => (
                    <tr
                      key={consult.id}
                      className="text-black text-sm font-normal border-t border-[#3499d6]/25 hover:bg-gray-100"
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        {new Date(consult.date_time).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {consult.patient.first_name +
                          " " +
                          consult.patient.last_name}
                      </td>
                      <td className="p-4">
                        {consult.provider.first_name +
                          " " +
                          consult.provider.last_name}
                      </td>
                      <td className="p-4">{consult.clinic?.name}</td>
                      <td className="p-4">{consult.service?.name}</td>
                      <td className="p-4">{consult.assessment}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {/* View Button */}
                          <button
                            className="rounded cursor-pointer"
                            onClick={() => {
                              navigate("/consult", {
                                state: {
                                  selectedEvent: {
                                    serviceName: consult.service?.name,
                                    localServiceId: consult.service?.id,
                                    serviceId: consult.service?.id,
                                    title:
                                      consult.patient.first_name +
                                      " " +
                                      consult.patient.last_name,
                                    ms_booking_id: consult.ms_booking_id,
                                    id: consult.id,
                                    healthCardNumber:
                                      consult.patient.health_card_number,
                                  },
                                },
                              });
                            }}
                          >
                            <i className="fa-regular fa-eye text-[#016c9d] text-lg"></i>
                          </button>
                          {/* Copy Link Button */}
                          <CopyButton
                            data={
                              import.meta.env.VITE_APP_URL +
                              "/consult?id=" +
                              consult.id
                            }
                          />
                          {/* Generate PDF Button */}
                          <PDFDownloadLink
                            document={<ConsultPDF consult={consult} />}
                            fileName={`consult_${consult.id}.pdf`}
                          >
                            {({ loading }) => (
                              <button className="bg-[#016c9d] text-white px-3 py-1 rounded">
                                {loading ? "Loading..." : "PDF"}
                              </button>
                            )}
                          </PDFDownloadLink>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      No consults found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultsWorkflow;
