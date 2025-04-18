import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import AdminHeader from "../../../components/AdminHeader/Adminheader";
import PaymentTable from "./components/PaymentTable";
import SearchBar from "./components/SearchBar";
import Header from "../../../components/ProviderListHeader/ProviderListHeader";
import { ActionModal } from "../../../components/ProviderActionModal/ProviderActionModals";
import { Payment } from "./types";
import axios, { AxiosError } from "axios";
import useAccount from "../../../components/Common/Hooks/useAccount";

interface FilterValues {
  physicianType: string;
  clinic: string;
  status: string[];
}

const PaymentList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [packages, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const account = useAccount();
  const [filters, setFilters] = useState<FilterValues>({
    physicianType: "",
    clinic: "",
    status: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get<Payment[]>(
        import.meta.env.VITE_SUPERADMIN_API +
          "/public/payments/" +
          account.email
      );
      console.log(response.data);

      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      const errorMessage =
        "An error occurred while fetching payments. Please try again later.";
      console.error("Error fetching payments:", error);
      setError(errorMessage);
      setLoading(false);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          navigate("/");
        }
      }
    }
  };

  useEffect(() => {
    if (account.email) {
      fetchPayments();
    }
  }, [account]);

  useEffect(() => {
    if (location.state?.showModal) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  const filteredPayments = packages.filter((item) => {
    const dateMatch =
      item.payment_date?.includes(filterText) || item.id.includes(filterText);

    return dateMatch;
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPayment = async (): Promise<void> => {
    //navigate("/admin/add-package");
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
          isSidebarOpen ? "blur-sm ml-[25%]" : ""
        }`}
      >
        <div className="flex flex-col space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <Header
              title="Payments"
              showAddButton={false}
              onAddClick={handleAddPayment}
            />
          </div>
          <div className="rounded-lg hidden">
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
            onConfirm={handleAddPayment}
            modalType="finish"
          />
          <div className="rounded-lg overflow-hidden shadow-md">
            <PaymentTable payments={filteredPayments} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentList;
