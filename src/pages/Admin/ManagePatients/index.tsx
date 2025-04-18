import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import AdminHeader from "../../../components/AdminHeader/Adminheader";
import ProviderHeader from "../../../components/ProviderListHeader/ProviderListHeader";
import FilterBox from "./components/FilterBox";
import { ActionModal } from "../../../components/ProviderActionModal/ProviderActionModals";
import PatientTable from "./components/PatientTable";
import { toast } from "react-toastify";
import * as utils from "../../../common/utils/utils";
import { Patient } from "../../../common/types/patient.type";
import { Provider } from "../../../common/types/provider.type";
interface Filters {
  searchTerm: string;
  age: [number, number];
  sex: string;
  clinic: string;
}

const ManagePatients: React.FC = () => {
  const location = useLocation();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedRows, setSelectedRows] = useState<Patient[]>([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [enableAssign, setEnableAssign] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (selectedRows.length > 0 && selectedProvider !== "") {
      setEnableAssign(true);
    } else {
      setEnableAssign(false);
    }
  }, [selectedRows, selectedProvider]);

  useEffect(() => {
    const fetchPatients = async () => {
      const params = new URLSearchParams(location.search);
      const providerId = params.get("providerId");

      if (providerId) {
        try {
          setIsLoading(true);
          const url =
            import.meta.env.VITE_BACKEND_URL +
            "/providers/:providerId/patients".replace(
              ":providerId",
              providerId
            );
          const response = await axiosInstance.get<Provider>(url);
          console.log(response.data);
          setProvider(response.data);
          setFilteredPatients(response.data.patients);
        } catch (error) {
          console.error("Error fetching patients:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatients();
  }, [location]);

  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };

  const handleProviderSelect = (provider: any) => {
    setSelectedProvider(provider.value);
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
    setShowReassignModal(true);
  };

  const assignProvider = async (
    selectedPatients: any,
    providerId: string,
    type: string = "temporary"
  ) => {
    try {
      const response = await axiosInstance.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/patients/update-provider/${providerId}/${type}`,
        { patients: selectedPatients }
      );
      if (response.data.success) {
        if (type != "temporary") {
          const updatedPatients = filteredPatients.filter(
            (p) =>
              !selectedPatients.some((selected: any) => selected.id === p.id)
          );
          setFilteredPatients(updatedPatients);
          setSelectedRows([]);
        }
        toast.success("Patients successfully assigned to the provider");
      } else {
        throw new Error(response.data.message || "Failed to assign patients");
      }
    } catch (error) {
      console.error("Error assigning patients:", error);
      toast.error("Failed to assign patients.");
    }
  };
  const handleReassignProvider = () => {
    assignProvider(selectedRows, selectedProvider, "permanent");
    setShowReassignModal(false);
  };

  const handleMoveTemporarily = () => {
    assignProvider(selectedRows, selectedProvider);

    setShowReassignModal(false);
  };

  const handleApplyFilters = (filters: Filters) => {
    if (!provider) return;
    const filteredPatients = provider.patients.filter((patient) => {
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

  const handleDelete = (patient: Patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (patientToDelete && provider) {
      try {
        // Assuming you have an API endpoint to delete a patient
        await axiosInstance.delete(
          `${import.meta.env.VITE_BACKEND_URL}/patients/${patientToDelete.id}`
        );

        const updatedPatients = provider.patients.filter(
          (p) => p.id !== patientToDelete.id
        );
        setProvider({ ...provider, patients: updatedPatients });
        setFilteredPatients(updatedPatients);

        toast.success("Patient deleted successfully ");
        setShowDeleteModal(false);
        setPatientToDelete(null);
      } catch (error: any) {
        toast.error(error.message);
        console.error("Error deleting patient:", error);
        // Handle error (e.g., show an error message to the user)
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
          <div className="bg-[#016189] rounded-lg ">
            <ProviderHeader
              title={
                provider
                  ? `Dr. ${provider.last_name}, ${provider.first_name}'s Patients`
                  : "Loading..."
              }
              showIcon={true}
              showAssignProviderButton={true}
              iconSrc={showFilterBox ? "/Icons/close.svg" : "/Icons/tune.svg"}
              textAlignment="left"
              iconColor="white"
              onIconClick={toggleFilterBox}
              onAssignProviderClick={handleAssignProvider}
              onProviderSelect={handleProviderSelect}
              enableAssign={enableAssign}
            />
          </div>
          {showFilterBox && (
            <div className=" rounded-lg border-2 border-[#83b3bb]">
              <FilterBox onApplyFilters={handleApplyFilters} />
            </div>
          )}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <PatientTable
              patients={filteredPatients}
              onSelectedRowsChange={setSelectedRows}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
      <ActionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        modalType="deleteConfirm"
      />
      <ActionModal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        onConfirm={handleMoveTemporarily}
        onAlternativeAction={handleReassignProvider}
        modalType="reassignPatients"
      />
    </div>
  );
};

export default ManagePatients;
