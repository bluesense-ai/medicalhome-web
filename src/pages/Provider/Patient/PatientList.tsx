import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import ProviderNavbar from "../../../components/ProviderNavbar";
import FilterBox from "./components/FilterBox";
import { Patient } from "../../../common/types/patient.type";
import { useSelector } from "react-redux";
import * as utils from "../../../common/utils/utils";
interface Filters {
  searchTerm: string;
  age: [number, number];
  sex: string;
  clinic: string;
}

const ConsultsWorkflow: React.FC = () => {
  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
      };
    }) => state.provider
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    let url = `${import.meta.env.VITE_BACKEND_URL}/providers/${provider.providerID}/patients`;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);
      } catch (err) {
        setError("Error fetching patients");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyFilters = (filters: Filters) => {
    if (!provider) return;
    const filteredPatients = patients.filter((patient) => {
      const searchMatch =
        !filters.searchTerm ||
        patient.last_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.first_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.health_card_number
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const patientAge = utils.calculateAge(patient.date_of_birth);

      const ageMatch =
        patientAge >= filters.age[0] && patientAge <= filters.age[1];
      const sexMatch =
        !filters.sex ||
        patient.sex?.toLowerCase() === filters.sex.toLowerCase();

      const clinicMatch =
        !filters.clinic ||
        (patient.preferred_clinic &&
          patient.preferred_clinic.name === filters.clinic);

      return searchMatch && ageMatch && sexMatch && clinicMatch;
    });
    console.log(filteredPatients);
    setFilteredPatients(filteredPatients);
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
          <h2 className="text-[#f2f8ff] text-2xl font-bold">Patient Database</h2>
        </div>
        <FilterBox  onApplyFilters={handleApplyFilters} />
        <div className="w-[80%] p-1 rounded-lg border-2 border-[#004f62]/70">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white-200 rounded-lg border border-[#004f62]/70 overflow-hidden">
              <thead className="text-[#004f62] text-sm font-semibold capitalize leading-normal tracking-wide">
                <tr>
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">First Name</th>
                  <th className="text-left p-4">Last Name</th>
                  <th className="text-left p-4">Age</th>
                  <th className="text-left p-4">Sex</th>
                  <th className="text-left p-4">Preferred Clinic</th>
                  <th className="text-left p-4">Most Visited</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((row, index) => (
                    <tr
                      key={row.id}
                      className="text-black text-sm font-normal border-t border-[#3499d6]/25 hover:bg-gray-100"
                    >
                      <td className="p-4">{index + 1}</td>

                      <td className="p-4">
                        {row.first_name}
                      </td>
                      <td className="p-4">
                        {row.last_name || ""}
                      </td>
                      <td className="p-4">
                       {utils.calculateAge(row.date_of_birth)}
                      </td>
                      <td className="p-4">
                        {row.sex || ""}
                      </td>
                      <td className="p-4">
                        { row.preferred_clinic?.name || ""}
                      </td>
                      <td className="p-4">
                        {row.most_visited_clinic?.name}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {/* View Button */}
                          <button
                            className="rounded cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/consult-history?patient_hcn=${row.health_card_number}`
                              );
                            }}
                          >
                            <img src="/Icons/note_add.svg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      No Patients found
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
