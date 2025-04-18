import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Provider } from "../../../../common/types/provider.type";
import axiosInstance from "../../../../axios/axiosInstance";
import { toast } from "react-toastify";

interface ProviderTableProps {
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
}

const ProviderTable: React.FC<ProviderTableProps> = ({ providers,setProviders }) => {
  const navigate = useNavigate();
  const handleEdit = (provider: Provider) => {
    console.log("provider...................", provider);
    navigate(`/edit-provider/${provider.id}`, { state: { provider } });
  };
  const handleViewPatients = (id: string) => {
    navigate(`/admin/manage-patients?providerId=${id}`);
  };
  const toggleAcceptingPatients = (id: string) => {
    const updatedProviders = providers.map((provider) => {
      if (provider.id === id) {
      console.log(provider);
        return { ...provider, accepting_patients: !provider.accepting_patients };
      }

      return provider;
    });
    setProviders(updatedProviders);
  };

  const handleToggleChange = async (id: string) => {

    toggleAcceptingPatients(id);
    console.log(providers);
    try {
     const response = await axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}/accepting-patients`);
     console.log(response);
    
    }catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } 
  };
  const columns = [
    {
      name: "MINC",
      selector: (row: Provider) => row.mnc_number ?? "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Avatar",
      center: true,
      cell: (row: Provider) => (
        <img
          src={`${import.meta.env.VITE_CDN_URL}/${import.meta.env.VITE_BUCKET_NAME}/${row.picture}`}
          alt={`${row.first_name}'s avatar`}
          className="w-8 h-8 rounded-full"
        />
      ),
    },
    {
      name: "First Name",
      selector: (row: Provider) => `${row.first_name}`,
      sortable: true,
      center: true,
    },
    {
      name: "Last Name",
      selector: (row: Provider) => row.last_name,
      sortable: true,
      center: true,
    },
    {
      name: "Patients",
      selector: (row: Provider) => row.patient_count,
      sortable: true,
      center: true,
    },
    {
      name: "Accepting Patients",
      cell: (row: Provider) => (
        row.accepting_patients ? (
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
        )
      ),
      center: true,
    },
    {
      name: "Provider Type",
      cell: (row: Provider) => (
        <span>{row.roles.map((role:any) => role.name).join(", ")}</span>
      ),
      id: "provider_type",
      sortable: true,
    },
    {
      name: "Clinics",
      cell: (row: Provider) => (
        <span>{row.clinics.map((item:any) => item.name).join(", ")}</span>
      ),
      id: "clinics",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Provider) => row.provider_status,
      cell: (row: Provider) => (
        <div className="flex items-center ml-4">
          <span
            className={`w-4 h-4 rounded-full mr-2 ${getStatusColor(
              row.provider_status
            )}`}
          ></span>
          {row.provider_status}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Provider) => (
        <div className="flex space-x-6">
          <button
            onClick={() => handleEdit(row)}
            className="text-teal-600 hover:text-teal-800"
          >
            <img src="/Icons/edit.svg" alt="Edit" className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewPatients(row.id)}
            className="text-teal-600 hover:text-teal-800"
          >
            <img src="/Icons/groups_2.svg" alt="Group" className="w-5 h-5" />
          </button>
        </div>
      ),
      center: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vacation":
        return "bg-[#3499D6]";
      case "Out of Office":
        return "bg-[#F6B818]";

      case "Available":
        return "bg-[#9CF200]";
      case 'On call':
        return "bg-[#CC2B29]";
      default:
        return "bg-gray-500";
    }
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#005164",
        color: "white",
        fontWeight: "semi-bold",
      },
    },
    headCells: {
      style: {
        justifyContent: "center",
        fontSize: "16px",
      },
    },
    rows: {
      style: {
        backgroundColor: "#f0f8ff",
        "&:hover": {
          backgroundColor: "#e6f3ff",
        },
      },
    },
    table: {
      style: {
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  return (
    <DataTable
      columns={columns}
      data={providers}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 15, 20]}
      paginationComponentOptions={paginationComponentOptions}
      customStyles={customStyles}
    />
  );
};

export default ProviderTable;
