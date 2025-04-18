// EditServicePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditProviderForm from "./components/EditServiceForm";
import ProviderHeader from "../../../../components/ProviderListHeader/ProviderListHeader";
import { Service } from "../../../../common/types/service.type";
import axiosInstance from "../../../../axios/axiosInstance";
import ProviderNavbar from "../../../../components/ProviderNavbar";



const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadService = async () => {
      try {

        if (id) {
          const response = await axiosInstance.get<Service>(
            `${import.meta.env.VITE_BACKEND_URL}/services/${id}`
          );
          
          setServiceData(response.data);
        }
      } catch (error) {
        console.error("Error loading service:", error);
        navigate("/provider-services");
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!serviceData) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen">
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <div
        className={`flex-col items-center justify-start mt-36 gap-[20px] w-full h-full ${isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
          }`}
      >
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader
              title="Edit Service"
              showAddButton={false}
              textAlignment="center"
            />
          </div>
          <div className="bg-white rounded-lg">
            <EditProviderForm initialData={serviceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
