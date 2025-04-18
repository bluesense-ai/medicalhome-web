import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../../../components/AdminHeader/Adminheader";
import ProviderHeader from "../../../components/ProviderListHeader/ProviderListHeader";
import WaitlistTable from "./components/WaitlistTable";
import FilterBox from "./components/FilterBox";
import axiosInstance from "../../../axios/axiosInstance";
import { toast } from "react-toastify";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth: string;
  preferred_clinic: string | null;
  preferred_provider: string | null;
  registered: boolean;
  createdAt: string;
}

interface Filters {
  searchTerm: string;
  clinic: string;
  fromDate: Date | null;
  toDate: Date | null;
  age: [number, number];
}

const WaitlistAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedRows, setSelectedRows] = useState<Patient[]>([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get<{
        success: boolean;
        message: string;
        data: Patient[];
      }>(import.meta.env.VITE_GET_WAITING_LIST_PATIENTS_ENDPOINT);
      if (response.data.success) {
        setPatients(response.data.data);
        setFilteredPatients(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("An error occurred while fetching patients. Please try again.");
      toast.error("Failed to load patients. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    const searchParams = new URLSearchParams(location.search);
    const providerId = searchParams.get("newProviderId");

    if (!providerId) {
      toast.error("Provider ID not found. Please try again.");
      return;
    }

    if (selectedRows.length === 0) {
      toast.warning("Please select patients to assign.");
      return;
    }

    try {
      const patientIds = selectedRows.map((patient) => patient.id);
      const endpoint =
        import.meta.env.VITE_ASSIGN_PATIENTS_TO_PROVIDER_ENDPOINT.replace(
          ":providerId",
          providerId
        );

      const response = await axiosInstance.post(endpoint, { patientIds });

      if (response.data.success) {
        toast.success("Patients successfully assigned to the provider");
        navigate("/admin/provider-list", { state: { showModal: true } });
      } else {
        throw new Error(response.data.message || "Failed to assign patients");
      }
    } catch (error) {
      console.error("Error assigning patients:", error);
      toast.error("Failed to assign patients. Please try again.");
    }
  };
  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };

  const handleApplyFilters = (filters: Filters) => {
    const filteredPatients = patients.filter((patient) => {
      const searchMatch =
        !filters.searchTerm ||
        patient.last_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.first_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.email_address
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.phone_number.includes(filters.searchTerm);

      const clinicMatch =
        !filters.clinic || patient.preferred_clinic === filters.clinic;

      const joinedDate = new Date(patient.createdAt);

      const fromDateMatch = !filters.fromDate || joinedDate >= filters.fromDate;

      const toDateMatch = !filters.toDate || joinedDate <= filters.toDate;

      // Calculate age based on date_of_birth
      const birthDate = new Date(patient.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      const ageMatch = age >= filters.age[0] && age <= filters.age[1];

      return (
        searchMatch && clinicMatch && fromDateMatch && toDateMatch && ageMatch
      );
    });

    setFilteredPatients(filteredPatients);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        userInitial="A"
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <main
        className={`container mx-auto px-9 py-6 ${
          isSidebarOpen ? "blur-sm ml-[30%] " : ""
        }`}
      >
        <div className="flex flex-col space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader
              title="Waitlist"
              showIcon={true}
              iconSrc={showFilterBox ? "/Icons/close.svg" : "/Icons/tune.svg"}
              textAlignment="left"
              iconColor="white"
              onIconClick={toggleFilterBox}
            />
          </div>
          {showFilterBox && (
            <div className="">
              <FilterBox onApplyFilters={handleApplyFilters} />
            </div>
          )}
          <div className="rounded-lg overflow-hidden shadow-md">
            <WaitlistTable
              patients={filteredPatients}
              onSelectedRowsChange={setSelectedRows}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleFinish}
              className="bg-[#33C213] hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
            >
              <img src="/Icons/check.svg" alt="Finish" width={16} height={16} />
              <span>Finish</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitlistAdmin;
