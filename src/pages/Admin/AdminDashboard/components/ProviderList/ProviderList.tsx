import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import axiosInstance from "../../../../../axios/axiosInstance";
import ProviderHeader from "../../../../../components/ProviderListHeader/ProviderListHeader";
import ProviderListTable from "./ProviderListTable";
import { Provider } from "./types";

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get<Provider[]>(
          import.meta.env.VITE_BACKEND_URL + "/providers/get-all-providers"
        );
        

        setProviders(response.data);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          "An error occurred while fetching providers. Please try again later.";
        console.error("Error fetching providers:", error);
        setError(errorMessage);
        setLoading(false);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            navigate("/admin/login");
          }
        }
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
  }, [navigate]);

  useEffect(() => {
    
  }, [providers]);

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
    <div className="flex justify-left mt-[50px] lg:px-[50px]">
      <div className="w-full max-w-[1300px] flex flex-col space-y-4">
        <ProviderHeader
          showIcon={true}
          iconSrc="/Icons/ButtonIcon.svg"
          title="Provider List"
          onIconClick={()=>navigate("/admin/provider-list")}
        />
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ProviderListTable providers={providers} />
        </div>
      </div>
    </div>
  );
};

export default ProviderList;
