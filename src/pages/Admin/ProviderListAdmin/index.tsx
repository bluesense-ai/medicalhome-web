import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import AdminHeader from "../../../components/AdminHeader/Adminheader";
import ProviderTable from "./components/ProviderTable";
import SearchBar from "./components/SearchBar";
import ProviderHeader from "../../../components/ProviderListHeader/ProviderListHeader";
import { ActionModal } from "../../../components/ProviderActionModal/ProviderActionModals";
import { Provider } from "./types";
import axios, { AxiosError } from "axios";

interface FilterValues {
  physicianType: string;
  clinic: string;
  status: string[];
}

const ProviderListAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    physicianType: "",
    clinic: "",
    status: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get<Provider[]>(
          import.meta.env.VITE_BACKEND_URL + "/providers/get-all-providers"
        );
        setProviders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to fetch providers. Please try again later.");
        setLoading(false);
      }
    };
    const fetchProviderPatients = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/providers/patients/count"
        );

        const patientCounts = response.data.data;

        setProviders((prevProviders) =>
          prevProviders.map((provider: any) => {
            const countData: any = patientCounts.find(
              (count: any) => count.id === provider.id
            );
            return {
              ...provider,
              patient_count: countData ? countData.totalPatients : 0,
            };
          })
        );
      } catch (error) {
        const errorMessage =
          "An error occurred while fetching data. Please try again later.";
        console.error("Error fetching providers:", error);
        setError(errorMessage);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            navigate("/admin/login");
          }
        }
      }
    };

    fetchProviders();
    fetchProviderPatients();
  }, []);

  useEffect(() => {
    if (location.state?.showModal) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  const filteredProviders = providers.filter((item) => {
    const textMatch =
      item.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id.includes(filterText) ||
      item.first_name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.roles.some((role: any) =>
        role.name.toLowerCase().includes(filterText.toLowerCase())
      );

    const physicianTypeMatch =
      filters.physicianType === "" ||
      item.roles.some((role: any) =>
        role.name.toLowerCase().includes(filters.physicianType.toLowerCase())
      );

    const statusMatch =
      filters.status.length === 0 ||
      filters.status.includes(item.provider_status);
    const clinicMatch =
      filters.clinic === "" ||
      item.clinics.find((c: any) => c.name === filters.clinic);

    return textMatch && physicianTypeMatch && statusMatch && clinicMatch;
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProvider = () => {
    navigate("/admin/add-provider");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
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
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader
              title="Provider list"
              showAddButton={true}
              onAddClick={handleAddProvider}
            />
          </div>
          <div className="rounded-lg">
            <SearchBar
              filterText={filterText}
              setFilterText={setFilterText}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <ActionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleAddProvider}
            modalType="finish"
          />
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderTable
              setProviders={setProviders}
              providers={filteredProviders}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderListAdmin;
