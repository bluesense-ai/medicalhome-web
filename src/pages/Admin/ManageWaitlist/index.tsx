import React, { useState, useEffect } from "react";
import AdminHeader from "../../../components/AdminHeader/Adminheader";
import ProviderHeader from "../../../components/ProviderListHeader/ProviderListHeader";
import WaitlistTable from "./components/WaitlistTable";
import FilterBox from "./components/FilterBox";
import { ActionModal } from "../../../components/ProviderActionModal/ProviderActionModals";
import axiosInstance from "../../../axios/axiosInstance";
import { toast } from "react-toastify";
import * as utils from "../../../common/utils/utils";

// Define the API Patient interface
interface ApiPatient {
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
  sex: string;
  preferred_provider_sex: string;
}

// Define the interface that matches your existing table structure
interface DisplayPatient {
  id: string;
  lastName: string;
  firstName: string;
  lookingFor: string;
  preferredClinic: string;
  joinedWaitlist: string;
  sex: string;
  dateOfBirth: string;
  preferred_provider_sex: string;
}

interface FilterState {
  searchTerm: string;
  physicianType: string;
  clinic: string;
  sex: string;
  age: [number, number];
  startDate: Date | null;
  endDate: Date | null;
}

const ManageWaitlistAdmin: React.FC = () => {
  const [patients, setPatients] = useState<DisplayPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<DisplayPatient[]>(
    []
  );
  const [selectedRows, setSelectedRows] = useState<DisplayPatient[]>([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<DisplayPatient | null>(
    null
  );
  const [enableAssign, setEnableAssign] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const providerId = searchParams.get("providerId");
    if (providerId) {
      setSelectedProvider(providerId);
    }
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0 && selectedProvider !== "") {
      setEnableAssign(true);
    } else {
      setEnableAssign(false);
    }
  }, [selectedRows, selectedProvider]);
  // Calculate age function

  // Transform API data to match your display format
  const transformApiData = (apiPatients: ApiPatient[]): DisplayPatient[] => {
    return apiPatients.map((patient: any) => ({
      id: patient.id,
      lastName: patient.last_name,
      firstName: `${patient.first_name}`,
      lookingFor: patient.preferred_provider_type || "",
      preferredClinic: patient.preferred_clinic?.name || "",
      joinedWaitlist: new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      sex: patient.sex || "Unknown",
      dateOfBirth: patient.date_of_birth,
      preferred_provider_sex: patient.preferred_provider_sex || "",
    }));
  };

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
        data: ApiPatient[];
      }>(import.meta.env.VITE_BACKEND_URL + "/patients/waiting-list");
      console.log(response);
      if (response.data.success) {
        const transformedPatients = transformApiData(response.data.data);

        setPatients(transformedPatients);
        setFilteredPatients(transformedPatients);
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

  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };

  const assignProvider = async (selectedPatients: any, providerId: string) => {
    try {
      const response = await axiosInstance.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/patients/assign-provider/${providerId}`,
        { patients: selectedPatients }
      );
      if (response.data.success) {
        const updatedPatients = patients.filter(
          (p) => !selectedPatients.some((selected: any) => selected.id === p.id)
        );
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setSelectedRows([]);
        toast.success("Patients successfully assigned to the provider");
      } else {
        throw new Error(response.data.message || "Failed to assign patients");
      }
    } catch (error) {
      console.error("Error assigning patients:", error);
      toast.error("Failed to assign patients.");
    }
  };

  const handleAssignProvider = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select patients to assign.", {
        autoClose: 2000,
      });
      return;
    } else if (selectedProvider === "") {
      toast.error("Please select a provider to assign.", {
        autoClose: 2000,
      });
      return;
    }
    assignProvider(selectedRows, selectedProvider);
  };
  const handleProviderSelect = (provider: any) => {
    setSelectedProvider(provider.value);
  };

  const handleApplyFilters = (filters: FilterState) => {
    const filtered = patients.filter((patient) => {
      // Search filter
      const searchMatch =
        !filters.searchTerm ||
        patient.lastName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.firstName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        patient.lookingFor
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      // Physician type filter
      const physicianTypeMatch =
        !filters.physicianType || patient.lookingFor === filters.physicianType;

      // Clinic filter
      const clinicMatch =
        !filters.clinic || patient.preferredClinic === filters.clinic;

      // Sex filter
      const sexMatch = !filters.sex || patient.sex === filters.sex;

      // Age filter
      const patientAge = utils.calculateAge(patient.dateOfBirth);
      const ageMatch =
        patientAge >= filters.age[0] && patientAge <= filters.age[1];

      const patientDate = new Date(patient.joinedWaitlist);
      const startDateMatch =
        !filters.startDate || patientDate >= new Date(filters.startDate);
      const endDateMatch =
        !filters.endDate || patientDate <= new Date(filters.endDate);

      return (
        searchMatch &&
        physicianTypeMatch &&
        clinicMatch &&
        sexMatch &&
        ageMatch &&
        startDateMatch &&
        endDateMatch
      );
    });
    console.log(filtered);
    setFilteredPatients(filtered);
  };

  const handleDelete = (patient: DisplayPatient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };
  const handleCancel = () => {
    setPatientToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (patientToDelete) {
      try {
        const response = await axiosInstance.put<{
          success: boolean;
          message: string;
        }>(
          `${import.meta.env.VITE_BACKEND_URL}/patients/un-register/${
            patientToDelete.id
          }`
        );
        if (response.data.success) {
          const updatedPatients = patients.filter(
            (p) => p.id !== patientToDelete.id
          );
          setPatients(updatedPatients);
          setFilteredPatients(updatedPatients);
          toast.success("Patient successfully removed from waitlist");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient. Please try again.");
      } finally {
        setShowDeleteModal(false);
        setPatientToDelete(null);
      }
    }
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
          isSidebarOpen ? "blur-sm ml-[30%]" : ""
        }`}
      >
        <div className="flex flex-col space-y-4">
          <div className="rounded-lg shadow-md">
            <ProviderHeader
              title="Waitlist"
              showIcon={true}
              showAssignProviderButton={true}
              iconSrc={showFilterBox ? "/Icons/close.svg" : "/Icons/tune.svg"}
              textAlignment="left"
              iconColor="white"
              onIconClick={toggleFilterBox}
              onAssignProviderClick={handleAssignProvider}
              onProviderSelect={handleProviderSelect}
              selectedProvider={selectedProvider}
              enableAssign={enableAssign}
            />
          </div>
          {showFilterBox && (
            <div className="border-2 border-[#83b3bb] rounded-lg">
              <FilterBox onApplyFilters={handleApplyFilters} />
            </div>
          )}
          <div className="rounded-lg overflow-hidden shadow-md">
            <WaitlistTable
              patients={filteredPatients}
              onSelectedRowsChange={setSelectedRows}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
      <ActionModal
        isOpen={showDeleteModal}
        onClose={handleCancel}
        onConfirm={confirmDelete}
        modalType="deleteConfirm"
      />
    </div>
  );
};

export default ManageWaitlistAdmin;
