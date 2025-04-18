import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { Service } from "../../../common/types/service.type";
import { useSelector } from "react-redux";
import ProviderNavbar from "../../../components/ProviderNavbar";
import FilterBox from "./components/FilterBoxService";
import { toast } from "react-toastify";
import { formatDate, parseDuration } from "../ProviderDashboard/local/common/helper";
import { ActionModal } from "../../../components/ProviderActionModal/ProviderActionModals";

interface FilterState {
  searchTerm: string;
}

const ProviderServices: React.FC = () => {
  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
      };
    }) => state.provider
  );
  const navigate = useNavigate();
  const [service, setServices] = useState<Service[]>([]);
  const [filterService, setFilterServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"save" | "delete" | "deleteService">("save");
  const [isLoading, setIsLoading] = useState(true);
  const fetchServices = useCallback(async () => {
    try {

      const response = await axiosInstance.get<Service[]>(
        `${import.meta.env.VITE_BACKEND_URL}/services/provider-service/${provider.providerID}`
      );
      setServices(response.data);
      setFilterServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Services:", err);
      setError("Failed to fetch services. Please try again later.");
      setLoading(false);
    }
  }, [provider.providerID]);


  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // const filteredServices = service.filter((item) => {
  //   const textMatch =
  //     item.name.toLowerCase().includes(filterText.toLowerCase()) ||
  //     item.default_duration.includes(filterText) ||
  //     item.description.toLowerCase().includes(filterText.toLowerCase());

  //   return textMatch;
  // });

  const handleAddProvider = () => {
    navigate("/add-service");
  };
  const refreshData = () => {

    console.log("Refreshing data...");
    fetchServices();
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
  const handleApplyFilters = (filters: FilterState) => {

    if (!service) return;
    const filterService = service.filter((ser) => {
      const searchMatch =
        !filters.searchTerm ||
        ser.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        ser.default_duration
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        ser.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())||
          ser.status
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase());

      return searchMatch;
    });
    console.log(filterService);
    setFilterServices(filterService);
  };

  const handleEdit = (services: Service) => {

    console.log("Service...................", services);
    navigate(`/edit-service/${services.id}`, { state: { services } });
  };

  const openModal = (type: "save" | "delete" | "deleteService") => {

    setModalType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleDelete = async (id: any) => {
    try {

      setIsLoading(true);
      console.log(isLoading)
      if (id) {

        const response = await axiosInstance.delete<Service>(
          `${import.meta.env.VITE_BACKEND_URL}/services/${id}`
        );

        if (response.status === 204) {
          toast.success("Provider service deleted successfully!", {
            autoClose: 3000,
          });
          refreshData()
        } else {
          toast.success("Failed to delete service!", {
            autoClose: 3000,
          });
        }

      }
    } catch (error) {
      toast.success("Failed to delete service!", {
        autoClose: 3000,
      });
      navigate("/provider-services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = async (id: string) => {
    
    console.log(service);
    try {


      const updateUrl = `${import.meta.env.VITE_BACKEND_URL}/services/${id
        }/update-status`;
      const serviceStatus = filterService.find(x => x.id == id)?.status;

      const body = { status: serviceStatus == 'active' ? 'inactive' : 'active' };
      const response = await axiosInstance.post(updateUrl, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Provider service update successfully!", {
          autoClose: 3000,
        });
        fetchServices();
      } else {
        toast.success("Failed to update service!", {
          autoClose: 3000,
        });
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <div
        className={`flex flex-col items-center justify-start mt-36 gap-[20px] w-full h-full ${isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
          }`}
      >
        <div className="w-[80%] h-16 py-[18.50px] bg-[#004f62] rounded-lg justify-center items-center inline-flex">
          <h2 className="text-[#f2f8ff] text-2xl font-bold">Provider Services</h2>
        </div>
        <div className="flex justify-between items-center w-[80%]">
          <div className="flex items-center">

            <FilterBox onApplyFilters={handleApplyFilters} />
          </div>
          <button
            onClick={handleAddProvider}
            className="flex items-center bg-[#004f62] text-white px-4 py-2 rounded-lg"
          >
            <img src="/Icons/add.svg" alt="Add" className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        </div>
        <div className="w-[80%] p-1 rounded-lg border-2 border-[#004f62]/70">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white-200 rounded-lg border border-[#004f62]/70 overflow-hidden">
              <thead className="text-[#004f62] text-sm font-semibold capitalize leading-normal tracking-wide">
                <tr>
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created Date</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filterService.length > 0 ? (
                  filterService.map((row, index) => (
                    <tr
                      key={row.id}
                      className="text-black text-sm font-normal border-t border-[#3499d6]/25 hover:bg-gray-100"
                    >
                      <td className="p-4">{index + 1}</td>

                      <td className="p-4">
                        {row.name}
                      </td>
                      <td className="p-4">
                        {parseDuration(row.default_duration) ?? "N/A"}
                      </td>
                      <td className="p-4">
                        {row.description || ""}
                      </td>
                      <td className="p-4">
                        {row.status == 'active' ? (
                          <img
                            src="/Icons/unchecked.svg"
                            alt="Close" className="w-10 h-10 cursor-pointer"
                            onClick={() => handleToggleChange(row.id)}
                          />
                        ) : (

                          <img src="/Icons/checked.svg"
                            width={20} alt="Check" className="w-10 h-10 cursor-pointer"
                            onClick={() => handleToggleChange(row.id)}
                          />
                        )}
                      </td>
                      <td className="p-4">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-6">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            <img src="/Icons/edit.svg" alt="Edit" className="w-10 h-10" />
                          </button>
                          <button
                            onClick={() => openModal("deleteService")}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            <img src="/Icons/delete_forever.svg" alt="Group" className="w-10 h-10" />
                          </button>
                          {/* Action Modal */}
                          <ActionModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onAlternativeAction={closeModal}
                            onConfirm={() => {

                              if (modalType === "deleteService") {

                                handleDelete(row.id);
                              } else {
                                closeModal();
                              }
                              closeModal();
                            }}
                            modalType={modalType}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      No Services found
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

export default ProviderServices;

