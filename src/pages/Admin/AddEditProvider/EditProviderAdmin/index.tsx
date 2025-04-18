// EditProviderPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../../../../components/AdminHeader/Adminheader";
import EditProviderForm from "./components/EditProviderForm";
import ProviderHeader from "../../../../components/ProviderListHeader/ProviderListHeader";
import { Provider } from "../../../../common/types/provider.type";



const EditProviderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProvider = async () => {
      try {
        // First check if we have provider data in location state
        if (location.state?.provider) {
          console.log(location.state.provider);
          const provider = location.state.provider;
          provider.picture = `${import.meta.env.VITE_CDN_URL}/${
            import.meta.env.VITE_BUCKET_NAME
          }/${provider.picture}`;
          setProviderData(provider);
          setIsLoading(false);
          return;
        }

        // If no state data, fetch from API
        if (id) {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/providers/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch provider");
          }
          const data = await response.json();
          setProviderData(data);
        }
      } catch (error) {
        console.error("Error loading provider:", error);
        navigate("/admin/provider-list");
      } finally {
        setIsLoading(false);
      }
    };

    loadProvider();
  }, [id, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!providerData) {
    return <div>Provider not found</div>;
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        userInitial="A"
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <main
        className={`container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${
          isSidebarOpen ? "blur-sm ml-[25%]" : ""
        } py-6`}
      >
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md">
            <ProviderHeader
              title={`${providerData.first_name} ${providerData.last_name}`}
              showAddButton={false}
              textAlignment="center"
            />
          </div>
          <div className="bg-white rounded-lg">
            <EditProviderForm initialData={providerData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProviderPage;
